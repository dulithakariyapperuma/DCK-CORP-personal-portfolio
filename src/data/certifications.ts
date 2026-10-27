// Illustrative records, not claims of earned credentials or official course titles.
// Replace these with real certificate details and set sample: false when ready.
export type Certification = {
  id: string; title: string; issuer: string; group: 'WSO2' | 'Cloud';
  year: string; description: string; skills: string[]; mark: 'layers' | 'orbit' | 'bolt' | 'peak';
  credentialId: string; sample: boolean;
};
export const certifications: Certification[] = [
  {id:'01',title:'API Management',issuer:'WSO2',group:'WSO2',year:'2026',mark:'layers',credentialId:'DEMO-WSO2-001',sample:true,description:'Illustrative certification dossier covering API design, lifecycle management, security, and integration with WSO2 technologies.',skills:['API lifecycle','OAuth 2.0','API gateways','Integration']},
  {id:'02',title:'Cloud Foundations',issuer:'Amazon Web Services',group:'Cloud',year:'2026',mark:'orbit',credentialId:'DEMO-AWS-002',sample:true,description:'Illustrative cloud fundamentals dossier exploring compute, storage, networking, and the shared responsibility model.',skills:['Cloud concepts','Compute & storage','Cloud security','Cost awareness']},
  {id:'03',title:'Azure Fundamentals',issuer:'Microsoft Azure',group:'Cloud',year:'2026',mark:'bolt',credentialId:'DEMO-AZURE-003',sample:true,description:'Illustrative learning record covering foundational Azure services, identity, governance, and cloud architecture.',skills:['Azure services','Identity & access','Governance','Cloud architecture']},
  {id:'04',title:'Cloud Essentials',issuer:'Google Cloud',group:'Cloud',year:'2026',mark:'peak',credentialId:'DEMO-GCP-004',sample:true,description:'Illustrative cloud learning dossier focused on infrastructure, data services, containers, and operational monitoring.',skills:['Infrastructure','Data services','Containers','Monitoring']},
];
