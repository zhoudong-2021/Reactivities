using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class AppException
    {
        public AppException(int statusCode, string message, string error = null)
        {
            Error = error;
            Message = message;
            StatusCode = statusCode;  
        }
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Error { get; set; }
    }
}