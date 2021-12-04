import React, { FC } from 'react'
import { PopoverProps } from 'types/popover'
import { Params } from 'types/status'
import { theme } from 'styles/theme'
import { convertIntoRGBA } from 'utils/color/convertIntoRGBA'
import { calculateMinSizeBasedOnFigmaWidth } from 'utils/calculateSizeBasedOnFigma'
import { BasicPopover } from 'components/ui/modal/BasicPopover'
import { EmployeeStatus } from 'components/models/employee/EmployeeStatus'
import { Tag } from 'components/ui/tag/Tag'
import styled from 'styled-components'

type Props = {
  className?: string
  id: string
  name: string
  icon_image: string
  technology: number
  achievement: number
  motivation: number
  solution: number
  plan: number
  design: number
  interests: { id: number; context: string }[]
  certifications: { id: number; name: string }[]
} & PopoverProps

export const EmployeePopover: FC<Props> = ({
  id,
  name,
  icon_image,
  anchorEl,
  vertical,
  horizontal,
  handleClose,
  technology,
  achievement,
  motivation,
  solution,
  plan,
  design,
  interests,
  certifications,
}) => {
  const params: Params[] = [
    { param: 'technology', value: technology },
    { param: 'achievement', value: achievement },
    { param: 'solution', value: solution },
    { param: 'motivation', value: motivation },
    { param: 'design', value: design },
    { param: 'plan', value: plan },
  ]
  const paramsSortedIntoThreeMaxValues = params
    .sort((prev, current) => (prev.value < current.value ? 1 : -1))
    .slice(0, 3)

  return (
    <BasicPopover
      anchorEl={anchorEl}
      vertical={vertical}
      horizontal={horizontal}
      handleClose={handleClose}>
      <StyledContainer>
        <StyledUpperRowContainer>
          <StyledUpperRow>
            <StyledImage src={icon_image} alt="icon" />
            <div>
              <div>lv enj</div>
              <div>HP,MP</div>
            </div>
          </StyledUpperRow>
          <StyledName>{name}</StyledName>
          <StyledId>{`#${id}`}</StyledId>
        </StyledUpperRowContainer>
        <StyledBorder />
        <StyledLowerRow>
          <div>
            <StyledH4>ステータス</StyledH4>
            <StyledBorder />
            <StyledEmployeeStatus>
              {paramsSortedIntoThreeMaxValues.map((item, index) => (
                <EmployeeStatus key={index} {...item} />
              ))}
            </StyledEmployeeStatus>
          </div>
          <div>
            <StyledH4>興味のあること</StyledH4>
            <StyledBorder />
            <StyledTagContainer>
              {interests.map((item, index) => (
                <Tag key={index} name={item.context} tagType="small" />
              ))}
            </StyledTagContainer>
          </div>
          <div>
            <StyledH4>資格</StyledH4>
            <StyledBorder />
            <StyledTagContainer>
              {certifications.map((item, index) => (
                <Tag key={index} name={item.name} tagType="small" />
              ))}
            </StyledTagContainer>
          </div>
        </StyledLowerRow>
      </StyledContainer>
    </BasicPopover>
  )
}

const StyledContainer = styled.div`
  width: ${calculateMinSizeBasedOnFigmaWidth(320)};
  border: 1px solid ${({ theme }) => theme.COLORS.BRANDY};
  background-color: ${({ theme }) => theme.COLORS.MINE_SHAFT};
  border-radius: 4px;
`
const StyledUpperRowContainer = styled.div`
  padding: ${calculateMinSizeBasedOnFigmaWidth(8)} ${calculateMinSizeBasedOnFigmaWidth(16)};
`
const StyledFlexCotaniner = styled.div`
  display: flex;
  align-items: center;
`
const StyledUpperRow = styled(StyledFlexCotaniner)`
  gap: ${calculateMinSizeBasedOnFigmaWidth(8)};
`
const StyledImage = styled.img`
  aspect-ratio: 1 / 1;
  width: ${calculateMinSizeBasedOnFigmaWidth(80)};
  height: ${calculateMinSizeBasedOnFigmaWidth(80)};
  border: 2px solid ${({ theme }) => theme.COLORS.BRANDY};
  border-radius: 2px;
  object-fit: cover;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
`
const StyledName = styled.h5`
  font-size: ${({ theme }) => theme.FONT_SIZES.SIZE_16};
  font-weight: ${({ theme }) => theme.FONT_WEIGHTS.BOLD};
  color: ${({ theme }) => theme.COLORS.WHITE};
`
const StyledId = styled.p`
  font-size: ${({ theme }) => theme.FONT_SIZES.SIZE_12};
  font-weight: ${({ theme }) => theme.FONT_WEIGHTS.NORMAL};
  color: ${({ theme }) => theme.COLORS.SILVER};
`
const StyledLowerRow = styled.div`
  width: 100%;
  max-height: ${calculateMinSizeBasedOnFigmaWidth(320)};
  padding: ${calculateMinSizeBasedOnFigmaWidth(8)} ${calculateMinSizeBasedOnFigmaWidth(16)};
  overflow-x: hidden;
  overflow-y: auto;
`
const StyledH4 = styled.h4`
  font-size: ${({ theme }) => theme.FONT_SIZES.SIZE_14};
  font-weight: ${({ theme }) => theme.FONT_WEIGHTS.BOLD};
  color: ${({ theme }) => theme.COLORS.WHITE};
`
const StyledBorder = styled.div`
  border: 1px solid ${convertIntoRGBA(theme.COLORS.BRANDY, 0.6)};
  border-radius: 4px;
`
const StyledMarginVertical = styled.div`
  margin: ${calculateMinSizeBasedOnFigmaWidth(8)} 0;
`
const StyledEmployeeStatus = styled(StyledMarginVertical)`
  display: flex;
  gap: ${calculateMinSizeBasedOnFigmaWidth(8)};
  justify-content: space-between;
`
const StyledTagContainer = styled(StyledMarginVertical)`
  display: flex;
  flex-wrap: wrap;
  gap: ${calculateMinSizeBasedOnFigmaWidth(8)};
`
