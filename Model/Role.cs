using System;
using System.Collections.Generic;

namespace CBMMIS_WebApi.Model
{
  public class Role
  {
    // testing update
    public int RoleKey { get; set; }
    public string RoleName { get; set; }
    public string RecordStatus { get; set; }
    public string CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public string UpdatedBy { get; set; }
    public DateTime UpdatedDate { get; set; }
  }

    public class RoleCollection
  {
    public int TotalRecord { get; set; }
    public List<Role> Records { get; set; }
  }
}
