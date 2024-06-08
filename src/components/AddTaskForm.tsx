import React, { useState } from "react"
import styled from "styled-components"
import useTaskStore from "../useTaskStore"

interface Task {
   id: number
   title: string
   description: string
   status: string
   createdAt: string
   updatedAt: string
   publishedAt: string
}

const AddTaskForm: React.FC<{ onTaskAdded: (task: Task) => void }> = ({ onTaskAdded }) => {
   const [title, setTitle] = useState<string>("")
   const [description, setDescription] = useState<string>("")
   const { addTask } = useTaskStore()

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
         await addTask(title, description, "not_completed")
         onTaskAdded({
            id: Date.now(), // временный id, пока не будет получен с сервера
            title,
            description,
            status: "not_completed",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
         })
         setTitle("")
         setDescription("")
      } catch (error) {
         console.error(error)
      }
   }

   return (
      <Form onSubmit={handleSubmit}>
         <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название задачи" required />
         <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание задачи" required />
         <Button type="submit">Добавить</Button>
      </Form>
   )
}

export default AddTaskForm

// Styled Components

const Form = styled.form`
   display: flex;
   flex-direction: column;
   align-items: center;
   margin-bottom: 20px;
`

const Input = styled.input`
   padding: 10px;
   margin-bottom: 10px;
   border: 1px solid #ccc;
   border-radius: 3px;
   width: 100%;
   max-width: 400px;
`

const Button = styled.button`
   padding: 10px 20px;
   border: none;
   border-radius: 3px;
   cursor: pointer;
   background-color: #28a745;
   color: white;
   &:hover {
      background-color: #218838;
   }
`
