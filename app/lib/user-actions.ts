'use server';

import { createClient } from '@/src/utils/supabase/server';
import { getUserTasks } from './task-actions';
import { getUserCategories } from './category-actions';

export async function getAllUsers() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .order('full_name');
  if (error) throw new Error(error.message);
  return data;
}

Promise.all([getUserTasks(), getUserCategories(), getAllUsers()])
  .then(([tasksData, categoriesData, usersData]) => {
    console.log('Users data:', usersData); // check this
    setTasks(tasksData);
    setCategories(categoriesData);
    setUsers(usersData);
    setError('');
  })

function setTasks(tasksData: any[]) {
    throw new Error('Function not implemented.');
}
function setCategories(categoriesData: any[]) {
    throw new Error('Function not implemented.');
}

function setUsers(usersData: { id: any; email: any; full_name: any; }[]) {
    throw new Error('Function not implemented.');
}

function setError(arg0: string) {
    throw new Error('Function not implemented.');
}

