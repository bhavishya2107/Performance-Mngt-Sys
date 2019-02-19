export const environment = {
  production: false,
  // apiUrl: "http://180.211.103.189:3000/api/",
  apiUrl: 'http://192.168.10.110:3000/api/',
  dynamicUrl: "http://192.168.10.110:3000/",
  publicUrl: "http://180.211.103.189:3000/api/"
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
  Project: "project_master"
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
  loginError:"Invalid username and password",
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
  ComplexityMaster:"Complexity Master"
};
