import React, { FC, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { Notifications } from 'types/notification'
import { DEFAULT_USER } from 'consts/defaultImages'
import { useAuthContext } from 'providers/AuthProvider'
import { useUsersLazyQuery } from './projectList.gen'
import { ProjectListHeader } from 'components/ui/header/ProjectListHeader'
import { ProjectListCreateModal } from 'components/models/projectList/ProjectListCreateModal'
import {
  calculateMinSizeBasedOnFigmaWidth,
  calculateVhBasedOnFigma,
} from 'utils/calculateSizeBasedOnFigma'
import { BUTTON_COLOR_TYPE, ComplicateButton } from 'components/ui/button/ComplicateButton'
import { ACTIVE_STATUS, ProjectListItem } from 'components/models/projectList/ProjectListItem'
import { LazyLoading } from 'components/ui/loading/LazyLoading'
import { ProjectListDetail } from 'components/models/projectList/ProjectListDetail'
import {
  projectListBodyWidth,
  projectListDetailMarginLeft,
} from 'utils/calculateProjectListDetailWidth'
import { convertIntoRGBA } from 'utils/color/convertIntoRGBA'

export const ProjectList: FC = () => {
  const { currentUser } = useAuthContext()
  const [getUserById, userData] = useUsersLazyQuery({
    onCompleted(data) {
      const notifications = data.user.invitations.map(invitation => {
        return {
          id: invitation.project.id,
          name: invitation.project.name,
          createAt: invitation.created_at,
        }
      })
      setNotifications(notifications)
    },
  })
  const [selectProject, setSelectProject] = useState(0)
  const [notifications, setNotifications] = useState<Notifications>([])
  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false)

  useEffect(() => {
    if (!currentUser) return
    getUserById({ variables: { id: currentUser.uid } })
  }, [currentUser])

  if (!currentUser) return <Navigate to="/signup" />

  return (
    <>
      <LazyLoading />
      <ProjectListHeader
        iconImage={userData.data?.user.icon_image ?? DEFAULT_USER}
        name={userData.data?.user.name ?? ''}
        uid={userData.data?.user.id ?? ''}
        totalExp={userData.data?.user.exp ?? 0}
        notifications={notifications}
      />

      <StyledProjectListPageContainer>
        <StyledProjectListContainer>
          <StyledProjectTitleWrapper>
            <StyledProjectTitle>プロジェクト一覧</StyledProjectTitle>
          </StyledProjectTitleWrapper>
          <StyledProjectListBodyWrapper>
            <StyledCreateProjectButton>
              <ComplicateButton
                buttonColorType={BUTTON_COLOR_TYPE.YELLOW}
                text="プロジェクト作成"
                onClick={() => setShouldShowModal(true)}
              />
            </StyledCreateProjectButton>

            <StyledScrollWrapper>
              <StyledProjectListScroll>
                <StyledProjectList>
                  {userData.data?.user.groups.map((group, index) => (
                    <StyledProject key={index} onClick={() => setSelectProject(index)}>
                      <ProjectListItem
                        activeStatue={
                          index === selectProject ? ACTIVE_STATUS.ACTIVE : ACTIVE_STATUS.NOT_ACTIVE
                        }
                        isEnd={group.project.project_end_flg}
                        projectTitle={group.project.name}
                        startDate={group.project.created_at}
                        endDate={group.project.end_date}
                      />
                    </StyledProject>
                  ))}
                </StyledProjectList>
              </StyledProjectListScroll>
            </StyledScrollWrapper>
          </StyledProjectListBodyWrapper>
        </StyledProjectListContainer>

        <StyledProjectListDetail
          isJoiningProject={!!userData.data?.user.groups.length}
          userQuery={userData.data}
          selectProject={selectProject}
          openModal={() => setShouldShowModal(true)}
        />

        <StyledProjectListBackground />
      </StyledProjectListPageContainer>

      <ProjectListCreateModal
        shouldShow={shouldShowModal}
        closeModal={() => setShouldShowModal(false)}
      />
    </>
  )
}

const StyledProjectListPageContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  ${({ theme }) =>
    css`
      padding-top: ${theme.HEADER_HEIGHT};
      max-width: ${theme.MAX_WIDTH};
      color: ${theme.COLORS.SHIP_GRAY};
    `}
`

const StyledProjectListContainer = styled.div`
  position: relative;
`

const projectListWrapperBoxCss = css`
  ${({ theme }) =>
    css`
      filter: drop-shadow(
          ${calculateMinSizeBasedOnFigmaWidth(3.06)} ${calculateMinSizeBasedOnFigmaWidth(1.6)}
            ${calculateMinSizeBasedOnFigmaWidth(3.06)}
            ${convertIntoRGBA(theme.COLORS.HELIOTROPE, 0.29)}
        )
        drop-shadow(
          0 ${calculateMinSizeBasedOnFigmaWidth(3.21)} ${calculateMinSizeBasedOnFigmaWidth(9.62)}
            ${convertIntoRGBA(theme.COLORS.PEACH_ORANGE, 0.76)}
        );
    `}
  opacity: 0.9;
`

const StyledProjectTitleWrapper = styled.div`
  position: relative;
  width: ${calculateMinSizeBasedOnFigmaWidth(306)};
  height: ${calculateMinSizeBasedOnFigmaWidth(90)};
  background: url('/svg/project-list_title-background.svg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  ${projectListWrapperBoxCss};
`

const StyledProjectTitle = styled.p`
  ${({ theme }) =>
    css`
      position: absolute;
      bottom: ${calculateMinSizeBasedOnFigmaWidth(3)};
      left: ${calculateMinSizeBasedOnFigmaWidth(84)};
      font-size: ${theme.FONT_SIZES.SIZE_18};
      color: ${theme.COLORS.WHITE};
    `}
`

const padding = `${calculateVhBasedOnFigma(64)} ${calculateMinSizeBasedOnFigmaWidth(
  9,
)} ${calculateVhBasedOnFigma(38)} 0` // ts-styled-pluginエラーを避けるため
const StyledProjectListBodyWrapper = styled.div`
  margin-top: ${calculateVhBasedOnFigma(-22)};
  padding: ${padding};
  width: ${projectListBodyWidth};
  height: ${calculateVhBasedOnFigma(708)};
  background: url('/svg/project-list_background.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  ${projectListWrapperBoxCss};
`

const StyledCreateProjectButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${calculateVhBasedOnFigma(24)};
`

const StyledScrollWrapper = styled.div`
  overflow-x: visible;
  margin-left: ${calculateMinSizeBasedOnFigmaWidth(15)};
  width: ${calculateMinSizeBasedOnFigmaWidth(439)};
`

const StyledProjectListScroll = styled.div`
  position: relative;
  display: flex;
  overflow-y: scroll;
  height: 100%;
`

const StyledProjectList = styled.ul`
  width: ${calculateMinSizeBasedOnFigmaWidth(396)};
`

const StyledProject = styled.li`
  cursor: pointer;
`

const StyledProjectListDetail = styled(ProjectListDetail)`
  margin-top: ${calculateVhBasedOnFigma(44)};
  margin-left: ${projectListDetailMarginLeft};
`

const StyledProjectListBackground = styled.div`
  ${({ theme }) =>
    css`
      position: absolute;
      z-index: ${theme.Z_INDEX.INDEX_MINUS_1};
      top: ${theme.HEADER_HEIGHT};
      left: 0;
      max-width: ${theme.MAX_WIDTH};
      width: 100vw;
      height: calc(100vh - ${theme.HEADER_HEIGHT});
    `}
  background: url('/images/project-list-page_background.webp');
  background-size: 100% 100%;
  background-repeat: no-repeat;
`
