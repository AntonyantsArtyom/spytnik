import React, { useState, useEffect, useRef, useCallback } from "react"
import useTaskStore from "../useTaskStore"
import styled from "styled-components"
import TaskItem from "./TaskItem"
import AddTaskForm from "./AddTaskForm"

const TaskList: React.FC = () => {
   const [filter, setFilter] = useState("all")
   const [page, setPage] = useState(1)
   const pageSize = 8

   const { tasks, loading, error, fetchTasks, hasMore } = useTaskStore()
   const observer = useRef<IntersectionObserver | null>(null)

   useEffect(() => {
      if (hasMore) fetchTasks(page, pageSize)
   }, [page, fetchTasks])

   const lastTaskElementRef = useCallback(
      (node: any) => {
         if (loading) return
         if (observer.current) observer.current.disconnect()
         observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
               setPage((prevPage) => prevPage + 1)
            }
         })
         if (node) observer.current.observe(node)
      },
      [loading]
   )

   const handleTaskAdded = () => {
      fetchTasks(1, pageSize)
   }

   if (error) return <div>Error: {error}</div>

   return (
      <TaskListContainer>
         <AddTaskForm onTaskAdded={handleTaskAdded} />
         <FilterButtons>
            <FilterButton onClick={() => setFilter("all")}>Все</FilterButton>
            <FilterButton onClick={() => setFilter("completed")}>Выполненные</FilterButton>
            <FilterButton onClick={() => setFilter("not_completed")}>Не выполненные</FilterButton>
            <FilterButton onClick={() => setFilter("favorite")}>Избранное</FilterButton>
         </FilterButtons>
         <TaskListItems>
            {tasks.map((task, index) => {
               const status = task.attributes.status
               const shouldDisplayTask =
                  filter === "all" ||
                  (filter === "completed" && status.split(" ").includes("completed")) ||
                  (filter === "not_completed" && !status.split(" ").includes("completed")) ||
                  (filter === "favorite" && status.split(" ").includes("favourite"))

               if (shouldDisplayTask) {
                  if (tasks.length === index + 1) {
                     return <TaskItem key={`${task.id}-${Date.now()}`} task={task} ref={lastTaskElementRef} />
                  } else {
                     return <TaskItem key={`${task.id}-${Date.now()}`} task={task} />
                  }
               }
               return null
            })}
         </TaskListItems>
      </TaskListContainer>
   )
}

export default TaskList

const TaskListContainer = styled.div`
   padding: 20px;
`

const FilterButtons = styled.div`
   display: flex;
   justify-content: space-between;
   margin-bottom: 20px;
`

const FilterButton = styled.button`
   padding: 10px 20px;
   font-size: 16px;
   cursor: pointer;
`

const TaskListItems = styled.div`
   list-style: none;
   padding: 0;
   height: 400px; /* Фиксированная высота */
   overflow-y: auto; /* Вертикальная прокрутка */
   border: 1px solid #ddd; /* Граница для лучшей видимости */
   border-radius: 5px;
`
