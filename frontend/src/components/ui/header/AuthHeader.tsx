import React, { FC } from 'react'
import { theme } from 'styles/theme'
import styled from 'styled-components'
import { SimpleRoundedButton } from 'components/ui/button/SimpleRoundedButton'
import { calculateMinSizeBasedOnFigmaWidth } from 'utils/calculateMinSizeBasedOnFigma'
import { useNavigate } from 'react-router-dom'

export const AuthHeader: FC = () => {
  const navigate = useNavigate()
  const commonButtonProps = {
    width: calculateMinSizeBasedOnFigmaWidth(120),
    height: calculateMinSizeBasedOnFigmaWidth(40),
    borderRadius: '2px',
  }
  const registerButtonProps = {
    border: `solid 1px ${theme.COLORS.DODGER_BLUE}`,
    bgColor: theme.COLORS.WHITE,
    fontColor: theme.COLORS.DODGER_BLUE,
    text: '新規登録',
  }
  const loginButtonProps = {
    border: `solid 1px ${theme.COLORS.DODGER_BLUE}`,
    bgColor: theme.COLORS.DODGER_BLUE,
    text: 'ログイン',
  }

  return (
    <StyledHeaderWrapper>
      <StyledLogoWrapper onClick={() => navigate('/')}>
        <StyledLogo src="svg/logo-transparent-background.svg" alt="TAoSK ロゴ" />
      </StyledLogoWrapper>

      <StyledButtonsWrapper>
        <SimpleRoundedButton
          {...commonButtonProps}
          {...registerButtonProps}
          onClick={() => navigate('/')}
        />
        <SimpleRoundedButton
          {...commonButtonProps}
          {...loginButtonProps}
          onClick={() => navigate('/signin')}
        />
      </StyledButtonsWrapper>
    </StyledHeaderWrapper>
  )
}

const StyledHeaderWrapper = styled.div`
  z-index: ${({ theme }) => theme.Z_INDEX.HEADER};
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${calculateMinSizeBasedOnFigmaWidth(28)};
  width: 100vw;
  height: ${calculateMinSizeBasedOnFigmaWidth(70)};
  background-color: ${({ theme }) => theme.COLORS.MINE_SHAFT};
`
const StyledLogoWrapper = styled.div`
  object-fit: contain;
  width: 100%;
  height: ${calculateMinSizeBasedOnFigmaWidth(43)};
  cursor: pointer;
`
const StyledLogo = styled.img`
  height: ${calculateMinSizeBasedOnFigmaWidth(43)};
`
const StyledButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${calculateMinSizeBasedOnFigmaWidth(14)};
  height: 100%;
`
