import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { TreatmentEventType } from 'app/entities/local-share/treatmentEvent';
import { Assessment } from 'app/entities/assessment/assessment.model';

import { TreatmentEventService } from 'app/entities/local-share/treatment-event.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { DatePipe, DOCUMENT, NgForOf, NgIf } from '@angular/common';
import { LocalStorageProgram } from 'app/entities/local-share/cache/local-storage.program';

import { Prog } from 'app/entities/prog/prog.model';
import { ProgNote } from 'app/entities/prog-note/prog-note.model';

import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { GroupExerciseMedia } from 'app/entities/exercise/group-exercise-media.model';
import { PaginationParams } from 'app/entities/local-share/pagination-params';
import { ParentNode } from 'app/entities/client/client-program/right-panel/tree/parent-node';
import { GroupExerciseMediaWrapper } from 'app/entities/exercise/group-exercise-media-wraper.model';
import { ProgGroupInstruction } from 'app/entities/prog-group-instruction/prog-group-instruction.model';
import { ProgEdit } from 'app/entities/prog-exer-group/prog-edit.model';
import { LocalStorageTree } from 'app/entities/local-share/cache/local-storage.tree';
import { LocalStorageNavigate } from 'app/entities/local-share/cache/local-storage.navigate';
import { ClientTabNavigateType } from 'app/entities/local-share/clientTabNavigate';
import { ExerciseMediaWrapper } from 'app/entities/exercise/exercise-media-wraper.model';
import { ExerciseMedia } from 'app/entities/exercise/exercise-media.model';
import { ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { ProgExerciseInstruction } from '../../../prog-exercise-instruction/prog-exercise-instruction.model';
import { ProgService } from '../../../prog/service/prog.service';
import { ExerciseService } from '../../../exercise/service/exercise.service';
import { ProgNoteService } from '../../../prog-note/service/prog-note.service';
import { MediaService } from '../../../media/service/media.service';
import { ExerGroupDetaillService } from '../../../exer-group-detaill/service/exer-group-detaill.service';
import { TreeExerciseNodeComponent } from './tree/tree-exercise-node.component';
import { FormsModule } from '@angular/forms';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProgramNoteDeleteComponent } from './program-note-delete.component';
import { TreeGroupNodeComponent } from './tree/tree-group-node.component';

@Component({
  standalone: true,
  selector: 'bc-program-select',
  templateUrl: './program-select.component.html',
  imports: [
    TreeExerciseNodeComponent,
    FormsModule,
    NgbInputDatepicker,
    FaIconComponent,
    ProgramNoteDeleteComponent,
    TreeGroupNodeComponent,
    NgIf,
    NgForOf,
  ],
})
export class ProgramSelectComponent implements OnInit {
  editMode = false;
  isViewProgram!: boolean;
  isViewGroupTree!: boolean;
  isViewExerciseTree!: boolean;

  // when note is select to delete
  deleteSelectedNote = false;

  // when new value entered in clinical note textarea
  isClinicalNoteChanged = false;

  selectedProgNote!: ProgNote;

  @Input()
  selectedProg!: Prog;

  progNotes!: ProgNote[] | null;

  @Input()
  selectedAssessment!: Assessment;

  @Output()
  instructionEmitter = new EventEmitter<ProgEdit>();

  @Output()
  groupButtonEmitter = new EventEmitter();

  @Output()
  exerciseButtonEmitter = new EventEmitter();

  // id of exercises that exists
  currentExerciseIds!: number[];
  exerGroupDetailMap = new Map<number, number>();

  // exerciseIds that already existed.
  persistedCheckedIds!: number[];

  statuses!: string[];
  isSaving = false;
  currentAccount: any;
  startDateDp!: any;
  endDateDp!: any;
  treatmentEventType: TreatmentEventType = TreatmentEventType.TREATMENT_ADD;
  // ***************************** Section ExerGroup page *************************
  exerGroups!: ExerGroup[];
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  previousPage: any;
  ngbPaginationPage = 1;
  paginationParams!: PaginationParams;

  // *********************** Group Exercise List ************************************************
  groupList!: GroupExerciseMedia[];
  treeData!: ParentNode[] | undefined;
  treeDataExercise!: ParentNode[];
  progGroupInstructions!: ProgGroupInstruction[];

  // *********************** Exercise List ************************************************
  exerciseMediaWrapper!: ExerciseMediaWrapper;

  progExerciseInstructions!: ProgExerciseInstruction[];
  exerciseMedia!: ExerciseMedia;

  constructor(
    public eventService: TreatmentEventService,
    private progService: ProgService,
    private exerciseService: ExerciseService,
    private progNoteService: ProgNoteService,
    private cacheProgram: LocalStorageProgram,
    private datePipe: DatePipe,
    private mediaService: MediaService,
    protected groupDetailService: ExerGroupDetaillService,
    protected cacheTree: LocalStorageTree,
    protected cache: LocalStorageNavigate,
    @Inject(DOCUMENT) private document: Document,
  ) {}
  // The majority of calls happens from parent not here. see initFromParent()
  ngOnInit() {
    // // fist update cache for group exercise
    // this.initGroupTreeFromCache();
    // // fist update cache for exercise
    // this.initExerciseTreeFromCache();

    this.initViewProgramButtonBox(true);

    const showGroupTree =
      this.cache.getClientTab() === ClientTabNavigateType.PROGRAMS_SELECT_GROUP.toString() ||
      this.cache.getClientTab() === ClientTabNavigateType.PROGRAMS_EDIT_INSTRUCTION.toString()
        ? true
        : false;

    this.initViewGroupExerciseButtonBox(showGroupTree);

    this.cacheProgram.cleanUpLocalStorage();
    if (!this.selectedProg) {
      this.selectedProg = {} as Prog;
      this.selectedProg.clinicalNote = {} as ProgNote;
    }
    if (this.selectedProg && !this.selectedProg.clinicalNote) {
      this.selectedProg.clinicalNote = {} as ProgNote;
    }

    if (this.selectedProg && this.selectedProg.clinicalNote && !this.selectedProg.clinicalNote.note) {
      this.selectedProg.clinicalNote.note = '';
    }
    this.initListBox();
  }

  loadIt() {
    if (this.selectedProg && this.selectedProg.id) {
      this.progService.find(this.selectedProg.id).subscribe(res => {
        const x: any = res.body;
        x.assessmentId = this.selectedAssessment.id;
        this.selectedProg = x;
      });
    }
  }

  clear() {
    this.treatmentEventType = TreatmentEventType.BACK;
  }
  save() {
    this.selectedProg.assessmentId = this.selectedAssessment.id;
    this.subscribeToSaveResponse(this.progService.update(this.selectedProg));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Prog>>): void {
    result.subscribe(res => this.onSaveSuccess(res.body));
  }
  private onSaveSuccess(result: any) {
    this.isSaving = false;
    this.selectedProg = result;
    const cacheNote = this.cacheProgram.getCurrentNote();

    if (cacheNote) {
      this.selectedProg.clinicalNote = cacheNote;
    } else if (this.progNotes && this.progNotes.length > 0) {
      this.selectedProg.clinicalNote = this.progNotes[0];
    }

    this.loadIt();
  }

  ngOnAssessment() {
    this.treatmentEventType = TreatmentEventType.BACK;
  }

  changeStatus(p: Prog, e: Event) {
    const prog: Prog = p;
    if (prog) {
      prog.status = this.findElementStringValue(e);
      this.selectedProg = prog;
    }
  }

  private findElementStringValue(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  initListBox() {
    this.statuses = [];
    this.statuses.push('Open');
    this.statuses.push('InProgress');
    this.statuses.push('Close');
  }

  changeForms() {
    this.isSaving = true;
  }

  getFormatDate(prog: Prog) {
    if (prog && prog.lastModifiedDate) {
      return this.datePipe.transform(prog.lastModifiedDate?.format('YYYY-MM-DD HH:mm'));
    }
    return '';
  }

  checkViewProgram(event: Event) {
    const target = event.target as HTMLInputElement;
    const x = target.checked ? true : false;
    this.initViewProgramButtonBox(x);
  }

  checkViewGroupExercise(event: Event) {
    const target = event.target as HTMLInputElement;
    const x = target.checked ? true : false;
    this.initViewGroupExerciseButtonBox(x);
  }

  checkViewExercise(event: Event) {
    const target = event.target as HTMLInputElement;
    const x = target.checked ? true : false;
    this.initViewExerciseButtonBox(x);
  }

  checkEditMode(event: Event) {
    const target = event.target as HTMLInputElement;
    this.editMode = target.checked ? true : false;
    if (!this.editMode) {
      const cacheValue = this.cacheProgram.getCurrentNote();
      if (!cacheValue) {
        this.selectedProg.clinicalNote = {} as ProgNote;
        this.selectedProg.clinicalNote.note = '';
      } else {
        this.selectedProg.clinicalNote = cacheValue;
      }
    }
    return this.editMode;
  }
  onSelectNote(progNote: ProgNote) {
    this.selectedProg.clinicalNote = progNote;
  }

  deleteNote(progNote: ProgNote) {
    this.selectedProgNote = progNote;
    this.deleteSelectedNote = true;
  }

  addRow() {
    if (this.progNotes && this.progNotes.length > 0) {
      this.selectedProg.clinicalNote = {} as ProgNote;
    }
    return false;
  }

  saveNotes() {
    const progNote = this.selectedProg.clinicalNote;
    if (progNote) {
      progNote.progId = this.selectedProg.id;
      if (progNote.id) {
        this.subscribeToSaveNoteResponse(this.progNoteService.update(progNote));
      } else {
        this.subscribeToSaveNoteResponse(this.progNoteService.create(progNote));
      }
    }
  }
  protected subscribeToSaveNoteResponse(resp: Observable<HttpResponse<ProgNote>>): void {
    resp.subscribe(res => this.onSaveNoteSuccess(res.body));
  }
  private onSaveNoteSuccess(result: ProgNote | null) {
    if (!this.progNotes) {
      this.progNotes = [];
    }
    if (result) {
      const found = this.progNotes.find(i => i.id === result.id);
      if (!found) {
        this.progNotes.unshift(result);
      } else {
        const filtered = this.progNotes.filter(i => i.id !== result.id);
        this.progNotes = filtered;
        this.progNotes.unshift(result);
      }
    }
    // update cache once the new is created. it is the last one onn the list
    this.selectedProg.clinicalNote = result!;
    this.cacheProgram.cleanUpLocalStorage();
    this.cacheProgram.addCurrentNote(this.selectedProg.clinicalNote);
    this.isClinicalNoteChanged = false;
  }
  cancelNoteDelete() {
    this.deleteSelectedNote = false;
  }
  confirmDeleteNote(progNote: ProgNote) {
    this.deleteSelectedNote = false;
    if (!this.selectedProg.clinicalNote) {
      this.selectedProg.clinicalNote = {} as ProgNote;
    }
    if (this.progNotes && this.progNotes.length > 0) {
      const filtered = this.progNotes?.filter(item => item.id !== progNote.id);
      this.progNotes = filtered;

      if (!filtered || filtered.length === 0) {
        this.selectedProg.clinicalNote.note = '';
      }
    } else {
      this.selectedProg.clinicalNote.note = '';
    }
    if (progNote.note === this.selectedProg.clinicalNote.note) {
      if (this.progNotes && this.progNotes.length > 0) {
        this.selectedProg.clinicalNote = this.progNotes[0];
      }
    }
    this.cacheProgram.cleanUpLocalStorage();
    this.cacheProgram.addCurrentNote(this.selectedProg.clinicalNote);
  }

  isNoteModified(note: string) {
    const cacheNote = this.cacheProgram.getCurrentNote();
    if (!cacheNote) {
      this.selectedProg.clinicalNote = {} as ProgNote;
      this.selectedProg.clinicalNote.note = note;
      this.isClinicalNoteChanged = true;
      return true;
    }

    if (cacheNote.note === note) {
      this.isClinicalNoteChanged = false;
      return false;
    }

    if (cacheNote.note !== note) {
      this.isClinicalNoteChanged = true;
      if (!this.selectedProg.clinicalNote) {
        this.selectedProg.clinicalNote = {} as ProgNote;
      }
      this.selectedProg.clinicalNote.note = note;
      return true;
    }

    return false;
  }
  cancelNote() {
    this.selectedProg.clinicalNote = this.cacheProgram.getCurrentNote();
    this.isClinicalNoteChanged = false;
  }
  initFromParent(prog: Prog) {
    this.initPaginationParams();
    this.selectedProg = prog;
    if (this.selectedProg && this.selectedProg.assessment) {
      this.selectedAssessment = this.selectedProg.assessment;
    }
    this.initTreeGroupExerciseList();
    this.initTreeExerciseList();
    this.cacheProgram.cleanUpLocalStorage();
    if (this.selectedProg && this.selectedProg.id) {
      this.progNoteService.findByProgId(this.selectedProg.id).subscribe(res => {
        this.progNotes = res.body;
        if (this.progNotes && this.progNotes.length > 0) {
          this.selectedProg.clinicalNote = this.progNotes[0];
          const note = this.progNotes[0];
          this.cacheProgram.addCurrentNote(note);
        } else {
          this.selectedProg.clinicalNote = {} as ProgNote;
          this.selectedProg.clinicalNote.note = '';
        }
      });
    }
  }
  initViewProgramButtonBox(v: boolean) {
    const x: any = document.getElementById('viewProgramId');
    x.checked = v;
    this.isViewProgram = v;
  }

  // **********************************************   Section Group Exercise *********************************

  initViewGroupExerciseButtonBox(v: boolean) {
    const x: any = document.getElementById('viewGroupExerId');
    x.checked = v;
    // we get the latest from cache
    if (v) {
      const tree = this.cacheTree.getTreeGroup();
      const copy: any = tree && tree.tree ? tree.tree : undefined;
      this.treeData = copy;
      this.progGroupInstructions = tree && tree.progGroupInstructions ? tree.progGroupInstructions : [];
      this.groupList = tree && tree.groupExerciseMedias ? tree.groupExerciseMedias : [];
    }

    this.isViewGroupTree = v;
  }

  // **********************************************   Section  Exercise *********************************
  initViewExerciseButtonBox(v: boolean) {
    const x: any = document.getElementById('viewExerId');
    x.checked = v;
    // we get the latest from cache
    if (v) {
      const tree = this.cacheTree.getTreeExercise();
      if (tree) {
        const copy: any = tree && tree.tree ? tree.tree : [];
        this.treeDataExercise = copy;
        this.progExerciseInstructions = tree.progExerciseInstructions ? tree.progExerciseInstructions : [];
        this.exerciseMedia = tree.exerciseMedia!;
      }
    }
    this.isViewExerciseTree = v;
  }

  // calls to get the list of Programs and its exercises with tree
  initTreeGroupExerciseList() {
    if (this.selectedProg) {
      this.loadPage(1);
    }
  }

  initTreeExerciseList() {
    if (this.selectedProg) {
      this.exerciseService.findSummaryMediaByProgId(this.selectedProg.id).subscribe(res => {
        if (res.body) {
          this.exerciseMediaWrapper = res.body;
          this.cacheTree.addTreeExercise(this.exerciseMediaWrapper);
        }
      });
    }
  }
  trackId(index: number, item: ExerGroup): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page || 1;
    this.exerciseService
      .findSummaryMediaGroupByProgId(
        {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        },
        this.selectedProg.id,
      )
      .subscribe((res: HttpResponse<GroupExerciseMediaWrapper>) => this.onSuccessWithMedia(res.body, res.headers, pageToLoad));
  }
  // this will be saved in Cache.
  protected onSuccessWithMedia(data: GroupExerciseMediaWrapper | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;

    if (data && data.groupExerciseMedias) {
      this.cacheTree.addTreeGroup(data);
      this.groupList = data.groupExerciseMedias;
      if (data.tree && data.tree.length > 0) {
        const copy: any = data.tree;
        this.treeData = copy;
      } else {
        this.cacheTree.cleanUpLocalGroupStorage();
      }
      if (data && data.progGroupInstructions) {
        this.progGroupInstructions = data.progGroupInstructions;
      }
    }
    this.ngbPaginationPage = this.page;
  }

  sort(): string[] {
    if (!this.predicate) {
      this.predicate = 'lastModifiedDate';
    }
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }
  private initPaginationParams(): PaginationParams {
    const params = new PaginationParams();
    this.page = 1;
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.previousPage = 1;
    params.itemsPerPage = this.itemsPerPage;

    params.maxSize = 5;
    params.currentPage = 1;
    params.destinationPage = 1;
    // reverse = false means DESC , the latest first
    params.reverse = false;
    this.predicate = 'lastModifiedDate';
    return params;
  }
  getGroupName(group?: GroupExerciseMedia) {
    if (group && group.exerGroup) {
      return group.exerGroup.name;
    }

    return '';
  }

  closeSlidingButton() {
    if (!this.selectedProg || !this.selectedProg.id) {
      const radio: any = document.getElementById('viewProgramId');
      if (radio && radio) {
        radio.checked = false;
      }
    }
  }

  gotToInstruction(progEdit: ProgEdit) {
    this.instructionEmitter.emit(progEdit);
  }
  // update or read the GroupExercise caching
  initGroupTreeFromCache() {
    const data: any = this.cacheTree.getTreeGroup();
    if (data) {
      if (data.groupExerciseMedias) {
        this.groupList = data.groupExerciseMedias;
      }

      if (data.tree) {
        this.treeData = data.tree;
      }
      if (data && data.progGroupInstructions) {
        this.progGroupInstructions = data.progGroupInstructions;
      }
    } else {
      this.initTreeGroupExerciseList();
    }
  }

  // update or read the GroupExercise caching
  initExerciseTreeFromCache() {
    const data: any = this.cacheTree.getTreeExercise();
    if (data && data.tree) {
      this.treeDataExercise = data.tree;
    } else {
      this.initTreeExerciseList();
    }
  }
  // goes to select group exercise
  goToSelectGroupExercise() {
    this.groupButtonEmitter.emit();
  }

  goToSelectExerciseList() {
    this.exerciseButtonEmitter.emit();
  }
}
// public getTreeData() {
//   const data: ParentNode[] = [
//     {
//       name: 'Fruit',
//       children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
//     },
//     {
//       name: 'Vegetables',
//       children: [
//         {
//           name: 'Green',
//           children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
//         },
//         {
//           name: 'Orange',
//           children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
//         },
//       ],
//     },
//   ];
//
//   return data;
// }
