let students = [
   { id: 1, name: "Ana", grade: 18 },
   { id: 2, name: "Luis", grade: 14 },
   { id: 3, name: "Pedro", grade: 10 }
];

function getAll() {
   return students;
}

function getById(id) {
   return students.find(s => s.id === id);
}

function create(student) {
   student.id = students.length + 1;
   students.push(student);
   return student;
}

function update(id, updateData) {
   const index = students.findIndex(s => s.id === id);
   if (index !== -1) {
       students[index] = { ...students[index], ...updateData };
       return students[index];
   }
   return null;
}

function remove(id) {
   const index = students.findIndex(s => s.id === id);
   if (index !== -1) {
       return students.splice(index, 1)[0];
   }
   return null;
}

module.exports = { getAll, getById, create, update, remove };