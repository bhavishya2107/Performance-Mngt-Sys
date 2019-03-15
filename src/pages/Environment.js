export const environment = {
  production: false,
  // apiUrl: "http://180.211.103.189:3000/api/",
  //  dynamicUrl: "http://180.211.103.189:3000/",
   apiUrl: 'http://192.168.10.110:3000/api/',
  dynamicUrl: "http://192.168.10.110:3000/",
  publicUrl: "http://180.211.103.189:3000/api/",
  emailToSend:"https://prod-17.centralindia.logic.azure.com:443/workflows/ecb28aa6326c46d2b632dbe5a34f76af/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qK3dMqlg6f1nEjlqWvG-KtxyVrAXqb3Zn1Oy5pJJrXs"
};
export const moduleUrls = {
  Kra: "kra_master",
  Kpi: "kpi_master",
  Designation: "designation_master",
  ComplexityMaster: "complexity_master",
  Department: "department_master",
  ScaleSet: "scale_set_master",
  Role: "role_master",
  User: "user_master",
  Project: "project_master",
  ProjectResources:"project_resources",
  Template:"template_master",
  Templatedetail:"template_detail",
  Quater:"quater_master",
  Template_assignment_master:"template_assignment_master",
  TAD:"template_assignment_detail"
};
export const Type = {
  get: "GET",
  post: "POST",
  patch: "PATCH",
  deletetype: "DELETE"
};
export const Notification = {
  saved: "Saved Successfully",
  updated: "Updated Successfully",
  deleted: "Deleted Successfully",
  deleteConfirm: "Are you sure you want to delete this record?",
  deleteInfo:"Please select atleast one record",
  deleteError:"Data is not deleted",
  notdeleted:"Not Deleted Successfully",
  selectOneRecord:"Please select atleast one record!",
  recordExists:"Record already exists",
  loginError:"Invalid username or password",
  EmailSent:"Email Sent Please Check your Email",
  ChangePassword:"Password Changed Successfully",
  MatchPassword:"Password Does Not Match",
  emailExist:"Email Does Not Exist"
  
};
export const ModuleNames = {
  kra: "KRA",
  kpi: "KPI",
  Designation: "Designation",
  Project: "Project",
  User: "User",
  Role: "Role",
  Department: "Department",
  ScaleSet: "Scale Set",
  ComplexityMaster:"Complexity Master",
  quater:"Quarter",
  Template:"Assign-Template"
}