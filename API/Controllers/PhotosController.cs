using System.Threading.Tasks;
using Application.photos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController: BaseApiController
    {
        // Upload Photo
        [HttpPost]
        // public async Task<IActionResult> AddPhoto([FromForm] Add.Command command)
        // {
        //     return HandleResult(await Mediator.Send(command));
        // }

         public async Task<IActionResult> AddPhoto(IFormFile file)
        {
            return HandleResult(await Mediator.Send(new Add.Command{File = file}));
        }

        // Delete Photo
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(string id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }

        // Set main photo
        [HttpPost("{id}/setmain")]
        public async Task<IActionResult> SetMain(string id)
        {
            return HandleResult(await Mediator.Send(new SetMain.Command{Id = id}));
        }
    }
}