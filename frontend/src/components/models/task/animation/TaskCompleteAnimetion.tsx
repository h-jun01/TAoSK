import React, { FCX } from 'react'
import { useCompleteAnimation } from 'hooks/useCompleteAnimation'
import { JsonType } from 'types/completeAnimation'
import styled from 'styled-components'

type Props = {
  json: JsonType
}
export const TaskCompleteAnimetion = React.forwardRef<HTMLDivElement>((props, ref) => {
  // const { anchorEl } = useCompleteAnimation<HTMLDivElement>(json)

  return (
    <StyledContainer>
      <StyledAnimation ref={ref} />
    </StyledContainer>
  )
})

TaskCompleteAnimetion.displayName = 'TaskCompleteAnimetion'

const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
`
const StyledAnimation = styled.div`
  width: 100%;
`
