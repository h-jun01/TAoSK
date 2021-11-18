export type allocationType = {
  id: string
  name: string
  icon_image: string
}

export type tasksType = {
  id: string
  overview: string
  explanation: string
  technology: number
  achievement: number
  solution: number
  motivation: number
  plan: number
  design: number
  weight: number
  vertical_sort: number
  end_date: any
  allocations: allocationType[]
}

export type listType = {
  index: number
  title: string
  tasks: tasksType[]
}
