import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'client',
    data: { pageTitle: 'Clients' },
    loadChildren: () => import('./client/client.routes'),
  },
  {
    path: 'position',
    data: { pageTitle: 'Positions' },
    loadChildren: () => import('./position/position.routes'),
  },
  {
    path: 'wsib',
    data: { pageTitle: 'Wsibs' },
    loadChildren: () => import('./wsib/wsib.routes'),
  },
  {
    path: 'therapy',
    data: { pageTitle: 'Therapies' },
    loadChildren: () => import('./therapy/therapy.routes'),
  },
  {
    path: 'supplier',
    data: { pageTitle: 'Suppliers' },
    loadChildren: () => import('./supplier/supplier.routes'),
  },
  {
    path: 'soap-note',
    data: { pageTitle: 'SoapNotes' },
    loadChildren: () => import('./soap-note/soap-note.routes'),
  },
  {
    path: 'service-type',
    data: { pageTitle: 'ServiceTypes' },
    loadChildren: () => import('./service-type/service-type.routes'),
  },
  {
    path: 'service-invoice',
    data: { pageTitle: 'ServiceInvoices' },
    loadChildren: () => import('./service-invoice/service-invoice.routes'),
  },
  {
    path: 'province',
    data: { pageTitle: 'Provinces' },
    loadChildren: () => import('./province/province.routes'),
  },
  {
    path: 'prog-note',
    data: { pageTitle: 'ProgNotes' },
    loadChildren: () => import('./prog-note/prog-note.routes'),
  },
  {
    path: 'instruction',
    data: { pageTitle: 'Instructions' },
    loadChildren: () => import('./instruction/instruction.routes'),
  },
  {
    path: 'prog-group-instruction',
    data: { pageTitle: 'ProgGroupInstructions' },
    loadChildren: () => import('./prog-group-instruction/prog-group-instruction.routes'),
  },
  {
    path: 'prog-exer-group',
    data: { pageTitle: 'ProgExerGroups' },
    loadChildren: () => import('./prog-exer-group/prog-exer-group.routes'),
  },
  {
    path: 'body-part',
    data: { pageTitle: 'BodyParts' },
    loadChildren: () => import('./body-part/body-part.routes'),
  },
  {
    path: 'muscle',
    data: { pageTitle: 'Muscles' },
    loadChildren: () => import('./muscle/muscle.routes'),
  },
  {
    path: 'exercise-type',
    data: { pageTitle: 'ExerciseTypes' },
    loadChildren: () => import('./exercise-type/exercise-type.routes'),
  },
  {
    path: 'movement',
    data: { pageTitle: 'Movements' },
    loadChildren: () => import('./movement/movement.routes'),
  },
  {
    path: 'exercise-tool',
    data: { pageTitle: 'ExerciseTools' },
    loadChildren: () => import('./exercise-tool/exercise-tool.routes'),
  },
  {
    path: 'exercise',
    data: { pageTitle: 'Exercises' },
    loadChildren: () => import('./exercise/exercise.routes'),
  },
  {
    path: 'product',
    data: { pageTitle: 'Products' },
    loadChildren: () => import('./product/product.routes'),
  },
  {
    path: 'product-specification',
    data: { pageTitle: 'ProductSpecifications' },
    loadChildren: () => import('./product-specification/product-specification.routes'),
  },
  {
    path: 'order',
    data: { pageTitle: 'Orders' },
    loadChildren: () => import('./order/order.routes'),
  },
  {
    path: 'prog',
    data: { pageTitle: 'Progs' },
    loadChildren: () => import('./prog/prog.routes'),
  },
  {
    path: 'product-order',
    data: { pageTitle: 'ProductOrders' },
    loadChildren: () => import('./product-order/product-order.routes'),
  },
  {
    path: 'invoice',
    data: { pageTitle: 'Invoices' },
    loadChildren: () => import('./invoice/invoice.routes'),
  },
  {
    path: 'product-invoice',
    data: { pageTitle: 'ProductInvoices' },
    loadChildren: () => import('./product-invoice/product-invoice.routes'),
  },
  {
    path: 'plan',
    data: { pageTitle: 'Plans' },
    loadChildren: () => import('./plan/plan.routes'),
  },
  {
    path: 'plan-note',
    data: { pageTitle: 'PlanNotes' },
    loadChildren: () => import('./plan-note/plan-note.routes'),
  },
  {
    path: 'payment-invoice',
    data: { pageTitle: 'PaymentInvoices' },
    loadChildren: () => import('./payment-invoice/payment-invoice.routes'),
  },
  {
    path: 'payment-invoice-details',
    data: { pageTitle: 'PaymentInvoiceDetails' },
    loadChildren: () => import('./payment-invoice-details/payment-invoice-details.routes'),
  },
  {
    path: 'order-payment',
    data: { pageTitle: 'OrderPayments' },
    loadChildren: () => import('./order-payment/order-payment.routes'),
  },
  {
    path: 'operation',
    data: { pageTitle: 'Operations' },
    loadChildren: () => import('./operation/operation.routes'),
  },
  {
    path: 'my-service',
    data: { pageTitle: 'MyServices' },
    loadChildren: () => import('./my-service/my-service.routes'),
  },
  {
    path: 'my-product-fee',
    data: { pageTitle: 'MyProductFees' },
    loadChildren: () => import('./my-product-fee/my-product-fee.routes'),
  },
  {
    path: 'mva',
    data: { pageTitle: 'Mvas' },
    loadChildren: () => import('./mva/mva.routes'),
  },
  {
    path: 'medication',
    data: { pageTitle: 'Medications' },
    loadChildren: () => import('./medication/medication.routes'),
  },
  {
    path: 'media',
    data: { pageTitle: 'Media' },
    loadChildren: () => import('./media/media.routes'),
  },
  {
    path: 'insurance',
    data: { pageTitle: 'Insurances' },
    loadChildren: () => import('./insurance/insurance.routes'),
  },
  {
    path: 'injury',
    data: { pageTitle: 'Injuries' },
    loadChildren: () => import('./injury/injury.routes'),
  },
  {
    path: 'fee-type',
    data: { pageTitle: 'FeeTypes' },
    loadChildren: () => import('./fee-type/fee-type.routes'),
  },
  {
    path: 'exercise-level',
    data: { pageTitle: 'ExerciseLevels' },
    loadChildren: () => import('./exercise-level/exercise-level.routes'),
  },
  {
    path: 'exer-group-detaill',
    data: { pageTitle: 'ExerGroupDetaills' },
    loadChildren: () => import('./exer-group-detaill/exer-group-detaill.routes'),
  },
  {
    path: 'exer-group',
    data: { pageTitle: 'ExerGroups' },
    loadChildren: () => import('./exer-group/exer-group.routes'),
  },
  {
    path: 'ehc-primary',
    data: { pageTitle: 'EhcPrimaries' },
    loadChildren: () => import('./ehc-primary/ehc-primary.routes'),
  },
  {
    path: 'ehc-client',
    data: { pageTitle: 'EhcClients' },
    loadChildren: () => import('./ehc-client/ehc-client.routes'),
  },
  {
    path: 'ehc',
    data: { pageTitle: 'Ehcs' },
    loadChildren: () => import('./ehc/ehc.routes'),
  },
  {
    path: 'coverage',
    data: { pageTitle: 'Coverages' },
    loadChildren: () => import('./coverage/coverage.routes'),
  },
  {
    path: 'countries',
    data: { pageTitle: 'Countries' },
    loadChildren: () => import('./countries/countries.routes'),
  },
  {
    path: 'condition',
    data: { pageTitle: 'Conditions' },
    loadChildren: () => import('./condition/condition.routes'),
  },
  {
    path: 'clinic',
    data: { pageTitle: 'Clinics' },
    loadChildren: () => import('./clinic/clinic.routes'),
  },
  {
    path: 'client-invoice',
    data: { pageTitle: 'ClientInvoices' },
    loadChildren: () => import('./client-invoice/client-invoice.routes'),
  },
  {
    path: 'assessment',
    data: { pageTitle: 'Assessments' },
    loadChildren: () => import('./assessment/assessment.routes'),
  },
  {
    path: 'my-service-fee',
    data: { pageTitle: 'MyServiceFees' },
    loadChildren: () => import('./my-service-fee/my-service-fee.routes'),
  },
  {
    path: 'address',
    data: { pageTitle: 'Addresses' },
    loadChildren: () => import('./address/address.routes'),
  },
  {
    path: 'prog-exercise-instruction',
    data: { pageTitle: 'ProgExerciseInstructions' },
    loadChildren: () => import('./prog-exercise-instruction/prog-exercise-instruction.routes'),
  },
  {
    path: 'common-service-code',
    data: { pageTitle: 'CommonServiceCodes' },
    loadChildren: () => import('./common-service-code/common-service-code.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
