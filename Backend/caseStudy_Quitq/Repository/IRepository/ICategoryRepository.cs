using CaseStudy_Quitq.Models;
using System.Collections.Generic;

namespace CaseStudy_Quitq.Repository.IRepository
{
    public interface ICategoryRepository
    {
        string AddCategory(Category category);
        string DeleteCategory(int id);  
        List<Category> GetAllCategories();           
        List<Category> GetAllActiveCategories();     
        Category GetCategoryById(int id);
        string UpdateCategory(int id, Category updatedCategory);
    }
}
