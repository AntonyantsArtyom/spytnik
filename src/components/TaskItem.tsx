import { forwardRef } from "react"
import styled from "styled-components"
import useTaskStore from "../useTaskStore"

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

interface TaskItemProps {
   task: Task
}

const TaskItem = forwardRef<HTMLLIElement, TaskItemProps>(({ task }, ref) => {
   const { title, description, status } = task.attributes
   const isCompleted = status.split(" ").includes("completed")
   const isFavorite = status.split(" ").includes("favourite")
   const { toggleFavoriteStatus, toggleTaskStatus, deleteTask } = useTaskStore()

   const handleStatusChange = async () => {
      toggleTaskStatus(task.id)
   }

   const handleDelete = async () => {
      deleteTask(task.id)
   }

   const handleFavorite = async () => {
      await toggleFavoriteStatus(task.id)
   }

   return (
      <TaskContainer ref={ref}>
         <TaskContent>
            <TaskTitle completed={isCompleted}>{title}</TaskTitle>
            <TaskDescription>{description}</TaskDescription>
         </TaskContent>
         <ButtonGroup>
            <ActionButton onClick={handleStatusChange}>{isCompleted ? "Сделать невыполненной" : "Сделать выполненной"}</ActionButton>
            <ActionButton onClick={handleDelete}>Удалить</ActionButton>
            <FavoriteButton favorite={isFavorite} onClick={handleFavorite}>
               {isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
            </FavoriteButton>
         </ButtonGroup>
      </TaskContainer>
   )
})

export default TaskItem

// Styled Components

const TaskContainer = styled.li`
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 10px;
   margin: 10px 0;
   border: 1px solid #ddd;
   border-radius: 5px;
   background-color: #f9f9f9;
`

const TaskContent = styled.div`
   flex-grow: 1;
`

const TaskTitle = styled.span<{ completed: boolean }>`
   display: block;
   font-weight: ${({ completed }) => (completed ? "normal" : "bold")};
   color: ${({ completed }) => (completed ? "#999" : "#333")};
   text-decoration: ${({ completed }) => (completed ? "line-through" : "none")};
`

const TaskDescription = styled.span`
   display: block;
   color: #666;
`

const ButtonGroup = styled.div`
   display: flex;
   gap: 10px;
`

const ActionButton = styled.button`
   padding: 5px 10px;
   border: none;
   border-radius: 3px;
   cursor: pointer;
   background-color: #007bff;
   color: white;
   &:hover {
      background-color: #0056b3;
   }
`

const FavoriteButton = styled(ActionButton)<{ favorite: boolean }>`
   background-color: ${({ favorite }) => (favorite ? "#ffc107" : "#6c757d")};
   &:hover {
      background-color: ${({ favorite }) => (favorite ? "#e0a800" : "#5a6268")};
   }
`
