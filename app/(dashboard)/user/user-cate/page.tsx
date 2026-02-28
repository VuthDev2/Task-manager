import { getUserCategories } from '@/app/lib/category-actions';
import { getUserTasks } from '@/app/lib/task-actions';
import CategoriesClient from './CategoriesClient';

export default async function CategoriesPage() {
  const [categories, tasks] = await Promise.all([
    getUserCategories(),
    getUserTasks(),
  ]);
  return <CategoriesClient initialCategories={categories} initialTasks={tasks} />;
}