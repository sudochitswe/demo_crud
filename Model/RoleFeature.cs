using System;
using System.Collections.Generic;

namespace CBMMIS_WebApi.Model
{
  public class RoleFeature
  {
    public int RoleFeatureID { get; set; }
    public int RoleID { get; set; }
    public int FeatureID { get; set; }
    public int ViewPerm { get; set; }
    public int AddPerm { get; set; }
    public int EditPerm { get; set; }
    public int DeletePerm { get; set; }
    public int OtherPerm { get; set; }
    public string CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public string UpdatedBy { get; set; }
    public DateTime UpdatedDate { get; set; }
  }
  public class RoleFeatures
  {
    public string RoleFeatureID { get; set; }
    public string RoleID { get; set; }
    public string FeatureID { get; set; }
    public string ViewPerm { get; set; }
    public string AddPerm { get; set; }
    public string EditPerm { get; set; }
    public string DeletePerm { get; set; }
    public string OtherPerm { get; set; }
    public string CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public string UpdatedBy { get; set; }
    public DateTime UpdatedDate { get; set; }
  }
  public class RoleDetail 
  {
    public int RoleID { get;set; }
    public List<RoleFeature> roleFeatures { get; set; }

  }
}
