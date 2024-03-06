import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Client } from '../client.model';
import { Assessment } from 'app/entities/assessment/assessment.model';
import { AssessmentEventService } from 'app/entities/local-share/assessment-event.service';
import { ClientTabNavigateType } from 'app/entities/local-share/clientTabNavigate';
import { LocalStorageNavigate } from 'app/entities/local-share/cache/local-storage.navigate';
import { SoapNote } from 'app/entities/soap-note/soap-note.model';
import { ProgramEventType } from 'app/entities/local-share/programEvent';
import { Prog } from 'app/entities/prog/prog.model';
import { ProgramListComponent } from 'app/entities/client/client-program/left-panel/program-list.component';
import { ProgramSelectComponent } from 'app/entities/client/client-program/right-panel/program-select.component';
import { GroupAddComponent } from 'app/entities/client/client-program/right-panel/exercise-group/group-add.component';
import { ExerGroup } from 'app/entities/exer-group/exer-group.model';
import { ExerGroupWrapper } from 'app/entities/exer-group/exer-group-wrapper.model';
import { Exercise } from 'app/entities/exercise/exercise.model';
import { ProgGroupInstruction } from 'app/entities/prog-group-instruction/prog-group-instruction.model';
import { ProgEdit } from 'app/entities/prog-exer-group/prog-edit.model';
import { HttpResponse } from '@angular/common/http';
import { GroupExerciseMediaWrapper } from 'app/entities/exercise/group-exercise-media-wraper.model';
import { LocalStorageTree } from 'app/entities/local-share/cache/local-storage.tree';
import { AssessmentService } from '../../assessment/service/assessment.service';
import { ExerciseService } from '../../exercise/service/exercise.service';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { ProgramAddComponent } from './right-panel/program-add.component';
import { ProgramSelectAssessmentComponent } from './right-panel/program-select-assessment.component';
import { ProgramDeleteComponent } from './right-panel/program-delete.component';
import { GroupExerciseDetailComponent } from './right-panel/exercise-group/group-exercise-detail.component';
import { GroupInstructionAddComponent } from './right-panel/exercise-group/group-instruction-add.component';
import { ProgramInstructionEditComponent } from './right-panel/program-instruction-edit.component';
import { ExerciseSelectComponent } from './right-panel/exercise/exercise-select.component';
import { ExerciseInstructionAddComponent } from './right-panel/exercise/exercise-instruction-add.component';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-client-program-tab',
  templateUrl: './client-program-tab.component.html',
  imports: [
    ProgramListComponent,
    ProgramSelectComponent,
    ProgramAddComponent,
    ProgramSelectAssessmentComponent,
    ProgramDeleteComponent,
    GroupAddComponent,
    GroupExerciseDetailComponent,
    GroupInstructionAddComponent,
    ProgramInstructionEditComponent,
    ExerciseSelectComponent,
    ExerciseInstructionAddComponent,
    NgIf,
  ],
})
export class ClientProgramTabComponent implements OnInit {
  programEventType!: ProgramEventType;
  selectedExerGroup!: ExerGroup;
  selectedSoapNote!: SoapNote;
  isAssessmentSelected = false;

  selectedProgGroupInstruction!: ProgGroupInstruction;

  @Input()
  client!: Client;
  assessments!: Assessment[];

  selectedProg!: Prog;

  selectedAssessment!: Assessment;
  currentAccount: any;
  currentSearch: string;
  totalItems: any;
  queryCount: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  routeData: any;
  links: any;
  isSaving!: boolean;
  prog!: Prog;
  eventSubscription!: Subscription;
  selectedExercise!: Exercise;
  exerGroupWrapper!: ExerGroupWrapper;

  @ViewChild(ProgramListComponent) childProgramList!: ProgramListComponent;
  @ViewChild(ProgramSelectComponent) childProgramSelect!: ProgramSelectComponent;
  @ViewChild(GroupAddComponent) childProgramExerGroupListComponent!: GroupAddComponent;
  constructor(
    private assessmentEventService: AssessmentEventService,
    private assessmentService: AssessmentService,
    private exerciseService: ExerciseService,
    private activatedRoute: ActivatedRoute,
    private cacheTree: LocalStorageTree,
    public zone: NgZone,
    public cache: LocalStorageNavigate,
    private ref: ChangeDetectorRef,
  ) {
    this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 1;
    this.previousPage = 1;
    this.reverse = true;
    this.predicate = 'id';
    // set the tab name to navigate between tabs for
    this.cache.cleanUpLocalStorage();
    this.cache.addClientTab(ClientTabNavigateType.PROGRAMS.toString());
    this.isAssessmentSelected = false;
  }
  ngOnInit() {
    this.cache.addClientTab(ClientTabNavigateType.PROGRAMS.toString());
    this.programEventType = ProgramEventType.PROGRAM_VIEW;
  }

  mainFirstPageWindow() {
    this.programEventType = ProgramEventType.PROGRAM_VIEW;
  }
  backToAddProgramSelectAssessment() {
    this.programEventType = ProgramEventType.PROGRAM_SELECT_ASSESSMENT;
    this.isAssessmentSelected = false;
  }

  // after assessment has been selected
  selectAssessment(selectedAssessment: Assessment) {
    this.selectedAssessment = selectedAssessment;
    this.isAssessmentSelected = true;
  }

  backToTabAfterAdd(prog: Prog) {
    this.programEventType = ProgramEventType.PROGRAM_VIEW;
    this.selectedProg = prog;
    this.childProgramList.loadPagefromParent();
  }
  backToTabAfterDelete() {
    this.programEventType = ProgramEventType.PROGRAM_VIEW;
    this.childProgramList.ngOnInit();
  }

  ngOnSelectProgram(prog: Prog) {
    // only change the selected program in the right panel when cursor is on View program or select Group
    if (this.programEventType === ProgramEventType.PROGRAM_VIEW || this.programEventType === ProgramEventType.PROGRAM_SELECT_GROUP) {
      this.selectedProg = prog;
      if (this.programEventType === ProgramEventType.PROGRAM_VIEW) {
        this.childProgramSelect.initFromParent(this.selectedProg);
      }
      if (this.selectedProg && this.selectedProg.assessmentId) {
        this.assessmentService.find(this.selectedProg.assessmentId).subscribe(res => {
          if (res && res.body) {
            this.selectedAssessment = res.body;
            this.selectedProg.assessment = res.body;
          }
        });
      }

      if (this.programEventType === ProgramEventType.PROGRAM_SELECT_GROUP) {
        this.childProgramExerGroupListComponent.initFromParent(this.selectedProg);
      }
    }
  }
  ngOnDeleteProg(prog: Prog) {
    this.selectedProg = prog;
    this.programEventType = ProgramEventType.PROGRAM_DELETE;
  }

  loadChildFromTab() {
    this.childProgramList.loadPagefromParent();
  }

  goToSelectGroupExercise() {
    this.programEventType = ProgramEventType.PROGRAM_SELECT_GROUP;
    this.cache.addClientTab(ClientTabNavigateType.PROGRAMS_SELECT_GROUP.toString());
  }

  goToSelectExercise() {
    this.programEventType = ProgramEventType.PROGRAM_SELECT_EXERCISE;
    // this.cache.addClientTab(ClientTabNavigateType.PROGRAMS_SELECT_GROUP.toString());
  }
  // this.programEventType = ProgramEventType.PROGRAM_ADD_GRPUP_EXER;
  addGroupExer() {}

  deleteExercise(prog: Prog) {
    // this.programEventType = ProgramEventType.PROGRAM_DELETE_EXER;
    this.prog = prog;
  }

  goToExerView(prog: Prog) {
    // this.programEventType = ProgramEventType.PROGRAM_VIEW_EXER;
    this.prog = prog;
  }

  backToProgramSelect(prog: Prog) {
    this.selectedProg = prog;
    this.programEventType = ProgramEventType.PROGRAM_VIEW;
  }

  cancelExerciseDelete(prog: Prog) {
    this.goToExerView(prog);
  }
  confirmDeleteProg() {
    this.programEventType = ProgramEventType.PROGRAM_VIEW;
    this.childProgramList.loadPagefromParent();
  }
  cancelDeleteProg() {
    this.programEventType = ProgramEventType.PROGRAM_VIEW;
  }
  addProgramSelectAssessment() {
    this.cache.addClientTab(ClientTabNavigateType.PROGRAMS_SELECT_ASSESMENT.toString());
    this.programEventType = ProgramEventType.PROGRAM_SELECT_ASSESSMENT;
    this.selectedProg.clientId = this.client.id;
  }

  afterSelectAssessment() {
    this.programEventType = ProgramEventType.PROGRAM_ADD;
  }
  // add treatment functionality
  goToViewFirstPage() {
    this.programEventType = ProgramEventType.PROGRAM_VIEW;
  }
  // after Program added
  confirmAddProg(prog: Prog) {
    this.selectedProg = prog;
    this.programEventType = ProgramEventType.PROGRAM_VIEW;
    this.childProgramList.loadPagefromParent();
  }

  backToProgramTab() {
    this.programEventType = ProgramEventType.PROGRAM_VIEW;
    this.childProgramList.ngOnInit();
  }
  backToGroupList() {
    this.programEventType = ProgramEventType.PROGRAM_SELECT_GROUP;
  }
  backToExerciseList() {
    this.programEventType = ProgramEventType.PROGRAM_SELECT_GROUP_EXERCISE;
  }
  disableAddTreatment() {
    return false;
  }

  disableBackButton() {
    return false;
  }
  getTabId() {
    return ClientTabNavigateType.TREATMENTS;
  }

  exerciseInGroup(exerGroup: ExerGroup) {
    this.programEventType = ProgramEventType.PROGRAM_SELECT_GROUP_EXERCISE;
    this.selectedExerGroup = exerGroup;
  }

  // calling when instruction button is cliced
  groupInstruction(exerGroupWrapper: ExerGroupWrapper) {
    if (exerGroupWrapper && exerGroupWrapper.exercise) {
      this.selectedExercise = exerGroupWrapper.exercise;
    }

    this.exerGroupWrapper = exerGroupWrapper;
    this.programEventType = ProgramEventType.PROGRAM_ADD_INSTRUCTION;
  }
  cancelInstruction() {
    this.programEventType = ProgramEventType.PROGRAM_SELECT_GROUP_EXERCISE;
  }

  goToInstruction(progEdit: ProgEdit) {
    if (progEdit) {
      if (progEdit.exercise) {
        this.selectedExercise = progEdit.exercise;
      }
      if (progEdit.group) {
        this.selectedExerGroup = progEdit.group;
      }
      if (progEdit.progGroupInstruction) {
        this.selectedProgGroupInstruction = progEdit.progGroupInstruction;
      }
    }
    this.programEventType = ProgramEventType.PROGRAM_EDIT_INSTRUCTION;
  }
  // this called only when progGroupInstruction in instrcution-add is loaded and updates the progInstrcution
  updateTreeCache() {
    this.exerciseService
      .findSummaryMediaGroupByProgId(
        {
          page: 1 - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        },
        this.selectedProg.id,
      )
      .subscribe((res: HttpResponse<GroupExerciseMediaWrapper>) => this.onSuccessWithMedia(res.body));
  }
  protected onSuccessWithMedia(data: GroupExerciseMediaWrapper | null): void {
    if (data && data.groupExerciseMedias && data.groupExerciseMedias.length > 0) {
      this.cacheTree.addTreeGroup(data);
    } else {
      this.cacheTree.cleanUpLocalGroupStorage();
    }
  }
  sort(): string[] {
    const result = [this.predicate + ',' + 'desc'];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  // update cache in
  initExerciseList() {
    if (this.selectedProg) {
      this.exerciseService.findSummaryMediaByProgId(this.selectedProg.id).subscribe(res => {
        if (res.body) {
          const exerciseMediaWrapper = res.body;
          this.cacheTree.addTreeExercise(exerciseMediaWrapper);
        }
      });
    }
  }

  goToExerciseInstruction(exercise: Exercise) {
    this.selectedExercise = exercise;
    this.programEventType = ProgramEventType.PROGRAM_SELECT_EXERCISE_INSTRUCTION;
  }
}
