import React, { FCX } from 'react'
import styled from 'styled-components'
import { StatusParam, assertStatusParam } from 'types/status'
import { calculateMinSizeBasedOnFigmaWidth } from 'utils/calculateSizeBasedOnFigma'
import { ProjectMyStatus } from 'components/models/project/ProjectMyStatus'

type Props = Record<StatusParam, number> & {
  isTaskCompleted: boolean
}

export const ProjectMyStatuses: FCX<Props> = ({ className, isTaskCompleted, ...statuses }) => {
  return (
    <StyledProjectMyStatusesContainer className={className}>
      {Object.keys(statuses).map(
        (status, index) =>
          assertStatusParam(status) && (
            <StyledProjectMyStatus
              statusType={status}
              statusNum={statuses[status]}
              isTaskCompleted={isTaskCompleted}
              key={index}
            />
          ),
      )}
    </StyledProjectMyStatusesContainer>
  )
}

const StyledProjectMyStatusesContainer = styled.div`
  display: flex;
`
const StyledProjectMyStatus = styled(ProjectMyStatus)`
  margin-left: ${calculateMinSizeBasedOnFigmaWidth(-2.5)};
`
