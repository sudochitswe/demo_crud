using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CBMMIS_WebApi.Model
{
    public class ResultStatus
    {
        
        public bool Status { get; set; }
        public string Message { get; set; }
        public dynamic Data { get; set; }

        public ResultStatus()
        {
            Status = true;
            Message = string.Empty;
            Data = null;
        }
    }
    // public class Collection
    // {
    //     public int totalRecord { get; set; }
    //     public dynamic records { get; set; }

    //     public Collection()
    //     {
    //         totalRecord = 0;
    //         records = null;
    //     }
    // }

    // public class Select
    // {
    //     public dynamic value { get; set; }
    //     public string label { get; set; }
    // }
}
