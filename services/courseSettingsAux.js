//Aux methods associated with the course settings page to help with downloads of files etc.
// Path: services/courseSettingsAux.js

export function showModuleTable(moduleTableVisible) {
    console.log('here')
    moduleTableVisible.value = !moduleTableVisible.value;
  }
  
  export function showQuizTable(quizTableVisible) {
    quizTableVisible.value = !quizTableVisible.value;
  }