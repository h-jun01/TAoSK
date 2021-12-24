import React, { FCX, ReactNode } from 'react'
import MuiModal from '@mui/material/Modal'
import { calculateMinSizeBasedOnFigma } from 'utils/calculateSizeBasedOnFigma'
import { strokeTextShadow } from 'utils/strokeTextShadow'
import { convertIntoRGBA } from 'utils/color/convertIntoRGBA'
import { CrossIcon } from 'components/ui/icon/CrossIcon'
import styled, { css, keyframes } from 'styled-components'
import { theme } from 'styles/theme'
import { backdropFadeIn, titleAnimation } from 'styles/animation/modalAnimation'

type Props = {
  title?: string
  shouldShow: boolean
  onClickCloseBtn: () => void
  children: ReactNode
}

export const Modal: FCX<Props> = ({ title, shouldShow, onClickCloseBtn, className, children }) => {
  return (
    <MuiModal
      open={shouldShow}
      onBackdropClick={() => onClickCloseBtn()}
      BackdropComponent={StyledBackdrop}
      BackdropProps={{ transitionDuration: 3000 }}>
      <StyledWrapper className={className}>
        <StyledCloseButton onClick={onClickCloseBtn}>
          <StyledCrossIcon color={theme.COLORS.DUSTY_GRAY} strokeLinecap="round" />
        </StyledCloseButton>

        {!!title && <StyledNamePlate>{title}</StyledNamePlate>}

        {children}
        <StyledBackgroundDragonSymbol />
      </StyledWrapper>
    </MuiModal>
  )
}

const StyledBackdrop = styled.div`
  z-index: ${({ theme }) => theme.Z_INDEX.INDEX_MINUS_1};
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => convertIntoRGBA(theme.COLORS.BLACK, 0.6)};
  opacity: 0;
  will-change: animation, opacity;
  animation: ${backdropFadeIn} 1s forwards linear;
`
const StyledWrapper = styled.div`
  z-index: ${({ theme }) => theme.Z_INDEX.MODAL};
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  background-image: url('/svg/modal-background.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
`
const StyledNamePlate = styled.p`
  z-index: ${({ theme }) => theme.Z_INDEX.INDEX_1};
  position: absolute;
  top: ${calculateMinSizeBasedOnFigma(-55 / 2)};
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${calculateMinSizeBasedOnFigma(468)};
  height: ${calculateMinSizeBasedOnFigma(55)};
  background-image: url('/svg/nameplate.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  animation: ${titleAnimation} 0.5s forwards ease;
  will-change: animation, opacity, transform;
  ${({ theme }) =>
    css`
      color: ${theme.COLORS.WHITE};
      font-size: ${theme.FONT_SIZES.SIZE_20};
      font-weight: ${theme.FONT_WEIGHTS.BOLD};
      ${strokeTextShadow('2px', theme.COLORS.BLACK)};
    `}
`
const StyledBackgroundDragonSymbol = styled.div`
  z-index: ${({ theme }) => theme.Z_INDEX.INDEX_MINUS_1};
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: ${calculateMinSizeBasedOnFigma(600)};
  height: ${calculateMinSizeBasedOnFigma(377)};
  background-image: url('/svg/dragon-symbol.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
`
const StyledCloseButton = styled.button`
  z-index: ${({ theme }) => theme.Z_INDEX.INDEX_2};
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: ${calculateMinSizeBasedOnFigma(-40 / 2)};
  right: ${calculateMinSizeBasedOnFigma(27)};
  width: ${calculateMinSizeBasedOnFigma(40)};
  height: ${calculateMinSizeBasedOnFigma(40)};
  border: solid 4px ${({ theme }) => convertIntoRGBA(theme.COLORS.MONDO, 0.8)};
  border-radius: 100%;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
`
const StyledCrossIcon = styled(CrossIcon)`
  height: 100%;
  svg {
    width: ${calculateMinSizeBasedOnFigma(20)};
    height: ${calculateMinSizeBasedOnFigma(20)};
  }
`
