export interface ActionState {
  error?: string
  success?: boolean
}

export interface EventActionState extends ActionState {
  eventId?: string
}