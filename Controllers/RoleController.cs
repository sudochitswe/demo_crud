using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CBMMIS_WebApi.Model;
using CBMMIS_WebApi.DataAccess;
using Newtonsoft.Json;

namespace CBMMIS_WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : Controller
    {

        // // GET: api/User
        // [HttpGet("[action]")]
        // //blank list OR object llist
        // public IEnumerable<Role> SelectAll()
        // {
        //     return RoleDA.SelectAll();
        // }
        
        //GET: api/User/filterBy
        [HttpGet("filterBy")]
        public ActionResult<RoleCollection> Get(int currentPage, int rowPerPage, string searchKeyword)
        {
            return RoleDA.SelectByFilter(currentPage, rowPerPage, searchKeyword);
        }

        // GET: api/User/6
        [HttpGet("[action]")]
        public ResultStatus SelectById(int id)
        {
            return RoleDA.SelectById(id);
        }

        //Get : api/duplicateRole
        [HttpGet("[action]")]
        public int GetDuplicateRole(string filter)
        {
            return RoleDA.GetDuplicateRole(filter);
        }

        // POST: api/User  
        [HttpPost("[action]")]
        public ResultStatus Create(Role item)
        {
            //dynamic Data = SessionHandler.Get(HttpContext.Session, "UserCredential");
            item.UpdatedBy = "admin";
            item.CreatedBy = "admin";
            return RoleDA.Create(item);
        }

        // PUT: api/User/
        [HttpPut("[action]")]
        public ResultStatus Update(Role item)
        {
            Console.WriteLine("Role Item RoleKey {0}",item.RoleKey);
            Console.WriteLine("Role Item RoleName  {0}",item.RoleName);
            //dynamic Data = SessionHandler.Get(HttpContext.Session, "UserCredential");
            item.UpdatedBy = "admin";
            return RoleDA.Update(item);
        }

        [HttpPost("[action]")]
        public ResultStatus Delete(Role item)
        {

                //dynamic Data = SessionHandler.Get(HttpContext.Session, "UserCredential");
                item.UpdatedBy = "admin";
                return RoleDA.Delete(item);
        }
    }
}