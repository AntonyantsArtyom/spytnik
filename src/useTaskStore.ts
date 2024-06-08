import create from "zustand"

interface TaskAttributes {
   title: string
   description: string
   status: string
   createdAt: string
   updatedAt: string
   publishedAt: string
}

interface Task {
   id: number
   attributes: TaskAttributes
}

interface TaskStore {
   tasks: Task[]
   loading: boolean
   error: string | null
   hasMore: boolean
   fetchTasks: (page: number, pageSize: number) => Promise<void>
   addTask: (title: string, description: string) => Promise<void>
   toggleFavoriteStatus: (id: number) => Promise<void>
   toggleTaskStatus: (id: number) => Promise<void>
   deleteTask: (id: number) => Promise<void>
}

const useTaskStore = create<TaskStore>((set, get) => ({
   tasks: [],
   hasMore: true,
   loading: false,
   error: null,
   fetchTasks: async (page: number, pageSize: number) => {
      if (!get().hasMore) return
      set({ loading: true, error: null })
      try {
         const response = await fetch(`https://cms.dev-land.host/api/tasks?pagination[page]=${page}&pagination[pageSize]=${pageSize}`)
         const data = await response.json()
         const tasks = data.data.map((task: any) => ({
            id: task.id,
            attributes: task.attributes,
         }))
         if (tasks.length == 0) set({ hasMore: false })
         set((state) => ({ tasks: [...state.tasks, ...tasks], loading: false }))
      } catch (error: any) {
         set({ error: error.message, loading: false })
      }
   },
   addTask: async (title: string, description: string) => {
      try {
         const response = await fetch("https://cms.dev-land.host/api/tasks", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer a56017bfd8f1a9d1c8d012e881ef7df90ddc4e3d74e61a27b82fa975cfe37571fcb0e7617258e871291c4315b68c1c410274fb19269becf5dae7b5372d611d66c605c701817bd70f8fcd39aa44973e95fb1dff1b36e3271ba4bf890e074e52d9b9feddcee0947e588d7b5f6eef4bd4ead3993c6ee7b35ffddf22012c2b5589ed`,
            },
            body: JSON.stringify({
               data: {
                  title,
                  description,
                  status: "not_completed",
               },
            }),
         })
         const newTask = await response.json()
         set((state) => ({
            tasks: [newTask.data, ...state.tasks],
         }))
      } catch (error) {
         console.error(error)
      }
   },
   toggleFavoriteStatus: async (id: number) => {
      set({ loading: true, error: null })
      try {
         const response = await fetch(`https://cms.dev-land.host/api/tasks/${id}`, {
            headers: {
               Authorization: `Bearer a56017bfd8f1a9d1c8d012e881ef7df90ddc4e3d74e61a27b82fa975cfe37571fcb0e7617258e871291c4315b68c1c410274fb19269becf5dae7b5372d611d66c605c701817bd70f8fcd39aa44973e95fb1dff1b36e3271ba4bf890e074e52d9b9feddcee0947e588d7b5f6eef4bd4ead3993c6ee7b35ffddf22012c2b5589ed`,
            },
         })
         const task = await response.json()
         const isFavorite = task.data.attributes.status.split(" ").includes("favourite")
         const updatedStatus = isFavorite
            ? task.data.attributes.status.replace(/\bfavourite\b/, "").trim()
            : `${task.data.attributes.status} favourite`.trim()

         await fetch(`https://cms.dev-land.host/api/tasks/${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer a56017bfd8f1a9d1c8d012e881ef7df90ddc4e3d74e61a27b82fa975cfe37571fcb0e7617258e871291c4315b68c1c410274fb19269becf5dae7b5372d611d66c605c701817bd70f8fcd39aa44973e95fb1dff1b36e3271ba4bf890e074e52d9b9feddcee0947e588d7b5f6eef4bd4ead3993c6ee7b35ffddf22012c2b5589ed`,
            },
            body: JSON.stringify({
               data: {
                  title: task.data.attributes.title,
                  description: task.data.attributes.description,
                  status: updatedStatus,
               },
            }),
         })

         set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? { ...t, attributes: { ...t.attributes, status: updatedStatus } } : t)),
            loading: false,
         }))
      } catch (error: any) {
         set({ error: error.message, loading: false })
      }
   },
   toggleTaskStatus: async (id: number) => {
      set({ loading: true, error: null })
      try {
         const response = await fetch(`https://cms.dev-land.host/api/tasks/${id}`, {
            headers: {
               Authorization: `Bearer a56017bfd8f1a9d1c8d012e881ef7df90ddc4e3d74e61a27b82fa975cfe37571fcb0e7617258e871291c4315b68c1c410274fb19269becf5dae7b5372d611d66c605c701817bd70f8fcd39aa44973e95fb1dff1b36e3271ba4bf890e074e52d9b9feddcee0947e588d7b5f6eef4bd4ead3993c6ee7b35ffddf22012c2b5589ed`,
            },
         })
         const task = await response.json()
         const isCompleted = task.data.attributes.status.split(" ").includes("completed")
         const updatedStatus = isCompleted
            ? task.data.attributes.status.replace(/\bcompleted\b/, "not_completed").trim()
            : task.data.attributes.status.replace(/\bnot_completed\b/, "completed").trim()

         await fetch(`https://cms.dev-land.host/api/tasks/${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer a56017bfd8f1a9d1c8d012e881ef7df90ddc4e3d74e61a27b82fa975cfe37571fcb0e7617258e871291c4315b68c1c410274fb19269becf5dae7b5372d611d66c605c701817bd70f8fcd39aa44973e95fb1dff1b36e3271ba4bf890e074e52d9b9feddcee0947e588d7b5f6eef4bd4ead3993c6ee7b35ffddf22012c2b5589ed`,
            },
            body: JSON.stringify({
               data: {
                  title: task.data.attributes.title,
                  description: task.data.attributes.description,
                  status: updatedStatus,
               },
            }),
         })

         set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? { ...t, attributes: { ...t.attributes, status: updatedStatus } } : t)),
            loading: false,
         }))
      } catch (error: any) {
         set({ error: error.message, loading: false })
      }
   },

   deleteTask: (id: number) => {
      return fetch(`https://cms.dev-land.host/api/tasks/${id}`, {
         method: "DELETE",
         headers: {
            Authorization: `Bearer a56017bfd8f1a9d1c8d012e881ef7df90ddc4e3d74e61a27b82fa975cfe37571fcb0e7617258e871291c4315b68c1c410274fb19269becf5dae7b5372d611d66c605c701817bd70f8fcd39aa44973e95fb1dff1b36e3271ba4bf890e074e52d9b9feddcee0947e588d7b5f6eef4bd4ead3993c6ee7b35ffddf22012c2b5589ed`,
         },
      })
         .then((response) => {
            if (!response.ok) {
               throw new Error("Failed to delete task")
            }
            set((state) => ({
               tasks: state.tasks.filter((task) => task.id !== id),
            }))
         })
         .catch((error: any) => {
            set({ error: error.message, loading: false })
         })
   },
}))

export default useTaskStore
