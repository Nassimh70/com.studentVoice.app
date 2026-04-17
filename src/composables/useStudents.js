import { ref } from 'vue'

const students = ref([
  { id: 1, name: 'Ahmed Idrissi', email: 'ahmed@email.com', phone: '+212 6 12 34 56 78', course: 'Mathématiques', average: 16.5, status: 'actif' },
  { id: 2, name: 'Fatima Bennani', email: 'fatima@email.com', phone: '+212 6 12 34 56 79', course: 'Physique', average: 14.0, status: 'actif' },
  { id: 3, name: 'Karim Alami', email: 'karim@email.com', phone: '+212 6 12 34 56 80', course: 'Informatique', average: 18.5, status: 'actif' },
])

export function useStudents() {
  const addStudent = (newStudent) => {
    const id = Math.max(...students.value.map(s => s.id), 0) + 1
    students.value.push({
      id,
      ...newStudent,
      average: 0,
      status: 'actif',
    })
  }

  const deleteStudent = (id) => {
    students.value = students.value.filter(s => s.id !== id)
  }

  return { students, addStudent, deleteStudent }
}
