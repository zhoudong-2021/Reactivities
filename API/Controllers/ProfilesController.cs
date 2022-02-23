using System.Threading.Tasks;
using Application.profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController:BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Username = username}));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetUserActivityDto(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(new ListActivities.Query{Username = username, Predicate = predicate}));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile(Edit.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }
    }

    
}