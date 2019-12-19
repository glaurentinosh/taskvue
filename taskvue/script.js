eventBus = new Vue()

Vue.component('todo-tabs', {
  props: {
    todos: {
      type: Array,
      required: true
    }
  },
  template: `<div>
  <div>
    <span :class="{ activeTab: selectedTab == tab }" v-for="(tab, index) in tabs" :key="index" @click="selectedTab = tab">{{ tab }}</span>
  </div>
  <div v-show="selectedTab == 'Todo List'">
    <p v-if="!todos.length">There are no todos yet.</p>
    <todos-table :todos="todos" v-else></todos-table>
  </div>
  <div v-show="selectedTab == 'Create a new Todo'">
    <todo-info :todos="todos"></todo-info>
  </div>
</div>`,
  data() {
    return {
      tabs: ['Create a new Todo', 'Todo List'],
      selectedTab: 'Todo List'
    }
  }
})

Vue.component('todo-info', {
  props: {
    todos: {
      type: Array,
      required: true
    }
  },
  template: `<form class="add-todo" @submit.prevent="addTodo"><div>
    <p>
      <label for="title">Title:</label>
      <input type="text" v-model="title">
    </p>
    <p>
      <label for="description">Description:</label>
      <textarea id="description" v-model="description"></textarea>
    </p>
    <p>
      <label for="relevance">Relevance</label>
      <select id="relevance" v-model.number="relevance">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </select>
      <label for="dueDate">Due date:</label>
      <input type="text" id="dueDate" v-model="dueDate">
    </p>
    <p>
      <button type="submit">Submit</button>
    </p>

  </div></form>`,
  data(){
    return {
      title: null,
      description: null,
      relevance: null,
      dueDate: null
    }
  },
  methods: {
    addTodo(){
      let newTodo = {
        title: this.title,
        description: this.description,
        relevance: this.relevance,
        dueDate: this.dueDate,
        done: false
      }
      eventBus.$emit('todo-submitted', newTodo)
      this.title = null
      this.description = null
      this.relevance = null
      this.dueDate = null
    }
  }
})

Vue.component('todos-table', {
  props: {
    todos: {
      type: Array,
      required: true
    }
  },
  template: `<div>
    <ul>
      <li v-for="todo in todos" :class="{ done: todo.done, todo: !todo.done }">
          <p>Title: {{todo.title}}</p>
          <p>Description: {{todo.description}}</p>
          <p>Relevance: {{todo.relevance}}</p>
          <p>Due date: {{todo.dueDate}}</p>
          <label for="done">Done:</label>
          <input id="done" type="checkbox" v-model="todo.done">
          <button @click="removeTodo(todo)" type="button">Delete</button>
      </li>
    </ul>
  </div>`,
  data(){
    return {
      
    }
  },
  methods: {
    removeTodo(todo){
      let id = this.todos.indexOf(todo)
      this.todos.splice(id, 1)
    }
  }
})

app = new Vue({
  el: "#app",
  data: {
    title: "To Do App",
    todos: []
  },
  mounted() {
    eventBus.$on('todo-submitted', todo => {
      this.todos.push(todo)
    })
  }
})