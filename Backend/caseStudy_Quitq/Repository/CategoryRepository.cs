using CaseStudy_Quitq.Contexts;
using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CaseStudy_Quitq.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public string AddCategory(Category category)
        {
            try
            {
                _context.Categories.Add(category);
                _context.SaveChanges();
                return "Category added successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding category: " + ex.Message);
            }
        }

        public string DeleteCategory(int id)
        {
            try
            {
                var category = _context.Categories.FirstOrDefault(c => c.CategoryId == id);
                if (category == null)
                    return $"Category with ID {id} not found.";

                if (category.IsDeleted)
                    return $"Category with ID {id} is already deleted.";

                category.IsDeleted = true;
                _context.Categories.Update(category);
                _context.SaveChanges();
                return $"Category with ID {id} soft-deleted successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception("Error soft-deleting category: " + ex.Message);
            }
        }

        public List<Category> GetAllCategories()
        {
            return _context.Categories.ToList(); // includes deleted
        }

        public List<Category> GetAllActiveCategories()
        {
            return _context.Categories
                .Where(c => !c.IsDeleted)
                .ToList();
        }

        public Category GetCategoryById(int id)
        {
            return _context.Categories.FirstOrDefault(c => c.CategoryId == id && !c.IsDeleted);
        }

        public string UpdateCategory(int id, Category updatedCategory)
        {
            try
            {
                var existing = _context.Categories.FirstOrDefault(c => c.CategoryId == id);
                if (existing == null)
                    return $"Category with ID {id} not found.";

                existing.Name = updatedCategory.Name;
                _context.SaveChanges();
                return $"Category with ID {id} updated successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating category: " + ex.Message);
            }
        }
    }
}
