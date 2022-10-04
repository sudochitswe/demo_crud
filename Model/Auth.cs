using System;
using System.Collections.Generic;
using System.Linq;

namespace CBMMIS_WebApi.Model
{
    public class Auth
    {
        public string loginID { get; set; }
        public string password { get; set; }
    }

    public class Credential
    {
        public string loginID { get; set; }
        public string displayName { get; set; }
        public bool isAuthenticated { get; set; }
        public int isforceToChangePW { get; set; }
        public List<AuthFeature> features { get; set; }
        public List<userRole> userRole { get; set; }
        public List<menuRole> menuRole { get; set; }

        public Credential()
        {
            loginID = "";
            displayName = "";
            isAuthenticated = false;
            features = new List<AuthFeature>();
            userRole = new List<userRole>();
            menuRole = new List<menuRole>();
        }
    }

    public class AuthFeature
    {
        // Feature Column
        public int featureKey { get; set; }
        //public int featureGroupKey { get; set; }
        public string featureName { get; set; }
        public string featureURL { get; set; }
        // RoleFeature Column
        public int viewPerm { get; set; }
        public int addPerm { get; set; }
        public int editPerm { get; set; }
        public int deletePerm { get; set; }
        public int otherPerm { get; set; }
    }

    public class userRole
    {
        public string UserID { get; set; }
        public string RoleKey { get; set; }
        public string RoleName { get; set; }
    }

    public class menuRole
    {
        public string MenuCode { get; set; }
        public string MenuGroupCode { get; set; }
    }
}
