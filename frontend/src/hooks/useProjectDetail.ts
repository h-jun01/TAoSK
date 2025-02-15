import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import logger from 'utils/debugger/logger'
import { List } from 'types/list'
import { GetProjectQuery, useGetProjectLazyQuery } from 'pages/projectDetail/projectDetail.gen'
import { LazyQueryResult } from '@apollo/client'
import { Exact } from 'types/graphql.gen'
import { useListsByTaskSubscription } from './subscriptions/useListsByTaskSubscription'
import { useListsByListSortSubscription } from './subscriptions/useListsByListSortSubscription'
import { useListsByListSubscription } from './subscriptions/useListsByListSubscription'
import { useListsByChatSubscription } from './subscriptions/useListsByChatSubscription'

type UseProjectDetail = {
  projectData: LazyQueryResult<
    GetProjectQuery,
    Exact<{
      id: string
    }>
  >
  monsterHPRemaining: number
  monsterTotalHP: number
  isTasks: boolean
}

export const useProjectDetail = (
  setSelectUserIds: Dispatch<SetStateAction<string[]>>,
  setList: Dispatch<SetStateAction<List[]>>,
): UseProjectDetail => {
  const { id: projectId } = useParams()
  const [monsterHPRemaining, setMonsterHPRemaining] = useState(0)
  const [monsterTotalHP, setMonsterTotalHP] = useState(0)
  const [isTasks, setIsTasks] = useState(false)

  const { updatedLists, updatedMonsterHPRemaining, updatedMonsterTotalHP, updatedIsTasks } =
    useListsByTaskSubscription()
  const { updatedListsByList } = useListsByListSubscription()
  const { updatedListsByListSort } = useListsByListSortSubscription()
  const { updatedListsByChat } = useListsByChatSubscription()

  const [getProjectById, projectData] = useGetProjectLazyQuery({
    onCompleted(data) {
      data.getProjectById.groups.map(group => {
        setSelectUserIds(groupList => [...groupList, group.user.id])
      })

      const sortList: List[] = data.getProjectById.lists.map(list => {
        const tasks = list.tasks.map(task => {
          const totalStatusPoint =
            task.technology +
            task.achievement +
            task.solution +
            task.motivation +
            task.plan +
            task.design

          setMonsterHPRemaining(monsterHPRemaining => {
            if (task.completed_flg) return monsterHPRemaining
            return monsterHPRemaining + totalStatusPoint
          })
          setMonsterTotalHP(monsterTotalHP => monsterTotalHP + totalStatusPoint)

          const allocations = task.allocations.map(allocation => ({ ...allocation.user }))

          return {
            ...task,
            allocations,
          }
        })

        setIsTasks(isTasks => {
          if (isTasks) return isTasks
          return !!tasks.length
        })

        return {
          id: list.id,
          list_id: list.list_id,
          sort_id: list.listSorts[0].id,
          index: list.listSorts[0].task_list,
          title: list.name,
          tasks: tasks.sort((a, b) => a.vertical_sort - b.vertical_sort),
        }
      })

      sortList.sort((a, b) => a.index - b.index)

      logger.debug(sortList)
      setList(sortList)
    },
    onError(err) {
      logger.debug(err)
    },
  })

  useEffect(() => {
    if (!projectId) return

    getProjectById({
      variables: {
        id: projectId,
      },
    })
  }, [projectId])

  // サブスクリプション, task周り
  useEffect(() => {
    setList([...updatedLists])
    setIsTasks(updatedIsTasks)
    setMonsterHPRemaining(updatedMonsterHPRemaining)
    setMonsterTotalHP(updatedMonsterTotalHP)
  }, [updatedLists, updatedMonsterHPRemaining, updatedMonsterTotalHP, updatedIsTasks])

  useEffect(() => {
    setList([...updatedListsByList])
  }, [updatedListsByList])

  useEffect(() => {
    setList([...updatedListsByListSort])
  }, [updatedListsByListSort])

  useEffect(() => {
    logger.debug(updatedListsByChat, 'hogehogehohgeohge')
    setList([...updatedListsByChat])
  }, [updatedListsByChat])

  return {
    projectData,
    monsterHPRemaining,
    monsterTotalHP,
    isTasks,
  }
}
