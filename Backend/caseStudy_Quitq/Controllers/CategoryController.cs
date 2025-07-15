using Microsoft.AspNetCore.Mvc;
using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;

namespace CaseStudy_Quitq.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepo;

        public CategoryController(ICategoryRepository categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }

        [HttpGet("active")]
        public IActionResult GetAllActiveCategories()
        {
            try
            {
                var categories = _categoryRepo.GetAllActiveCategories();
                return categories == null || !categories.Any()
                    ? NotFound("No active categories found.")
                    : Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        [HttpGet]
        public IActionResult GetAllCategories()
        {
            try
            {
                var categories = _categoryRepo.GetAllCategories();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetCategoryById(int id)
        {
            try
            {
                var category = _categoryRepo.GetCategoryById(id);
                return category == null ? NotFound("Category not found.") : Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        [HttpPost]
        public IActionResult AddCategory([FromBody] Category category)
        {
            try
            {
                var result = _categoryRepo.AddCategory(category);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error adding category: " + ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCategory(int id, [FromBody] Category category)
        {
            try
            {
                var result = _categoryRepo.UpdateCategory(id, category);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error updating category: " + ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCategory(int id)
        {
            try
            {
                var result = _categoryRepo.DeleteCategory(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error deleting category: " + ex.Message);
            }
        }
    }
}
