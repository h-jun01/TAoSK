import React, { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { REGEX_EMAIL, REGEX_PASSWORD, REGEX_TEXT } from 'consts/regex'
import { DEFAULT_USER, RESIZED_IMAGE_ASPECT } from 'consts/defaultImages'
import { useTrySignUp } from 'hooks/useTrySignUp'
import { useSignUpForm } from 'hooks/useSignUpForm'
import { useWatchInnerAspect } from 'hooks/useWatchInnerAspect'
import { useImageResize } from 'hooks/useImageResize'
import { useDataUrlToBlob } from 'hooks/useDataUrlToBlob'
import { useBlobToFile } from 'hooks/useBlobToFile'
import { AuthHeader } from 'components/ui/header/AuthHeader'
import { ImageInputField, UPLOAD_BUTTON } from 'components/ui/form/ImageInputField'
import { InputField } from 'components/ui/form/InputField'
import { PasswordField } from 'components/ui/form/PasswordField'
import { SelectField } from 'components/ui/form/SelectField'
import { ItemInputField } from 'components/ui/form/ItemInputField'
import { CoarseButton } from 'components/ui/button/CoarseButton'
import { convertIntoRGBA } from 'utils/color/convertIntoRGBA'
import { calculateMinSizeBasedOnFigma } from 'utils/calculateSizeBasedOnFigma'
import styled, { css } from 'styled-components'
import { theme } from 'styles/theme'
import { useOccupationLazyQuery } from './document.gen'
import logger from 'utils/debugger/logger'

export const SignUp: FC = () => {
  const { register, handleSubmit, getValues, isDisabled, errors, trigger } = useSignUpForm()
  const [certifications, setCertifications] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [occupationOptions, setOccupationOptions] = useState<Record<'value' | 'item', string>[]>([])
  const { canvasContext, imageUrl, initializeUploadImg, handleChangeImg } = useImageResize(
    DEFAULT_USER,
    RESIZED_IMAGE_ASPECT,
  )
  const { blobData } = useDataUrlToBlob(canvasContext?.canvas.toDataURL())
  const { innerWidth } = useWatchInnerAspect()
  const { fileData } = useBlobToFile(blobData)
  const trySignUp = useTrySignUp({ ...getValues(), certifications, interests, fileData })

  const [getOccupations] = useOccupationLazyQuery({
    onCompleted(data) {
      const occupations = data.getOccupations.map(v => {
        return { value: String(v.id), item: v.name }
      })
      occupations.unshift({ value: '', item: '選択' })

      setOccupationOptions(() => [...occupations])
      logger.debug('職業テーブル所得', occupations)
    },
  })

  useEffect(() => {
    getOccupations({
      variables: {},
    })
  }, [])

  return (
    <>
      <AuthHeader />
      <StyledWrapper>
        <StyledSignUp>
          <StyledLogoImg src="logo.png" alt="TAoSK ロゴ" />
          <StyledH1>新規登録書</StyledH1>
          <StyledFormWrapper>
            <StyledImageInputField
              image={imageUrl}
              defaultSrc={DEFAULT_USER}
              initializeUploadImg={initializeUploadImg}
              handleChangeImg={handleChangeImg}
              innerWidth={innerWidth}
              uploadButtonType={UPLOAD_BUTTON.COARSE_BUTTON}
            />
            <StyledRightColumn
              margin={
                innerWidth <= 1210
                  ? `0 auto ${calculateMinSizeBasedOnFigma(24)} auto`
                  : `0 0 ${calculateMinSizeBasedOnFigma(24)} 0`
              }>
              <StyledInputField
                label="冒険者名"
                placeholder="お名前を入力してください"
                registration={register('name', {
                  required: '未入力です',
                  maxLength: {
                    value: 50,
                    message: '50文字以内で入力してください',
                  },
                  pattern: {
                    value: REGEX_TEXT,
                    message: '空白が含まれてます',
                  },
                })}
                error={errors['name']}
              />
              <StyledInputField
                label="会社名"
                placeholder="例：学校法人日本教育財団HAL"
                registration={register('company', {
                  required: '未入力です',
                  maxLength: {
                    value: 50,
                    message: '50文字以内で入力してください',
                  },
                  pattern: {
                    value: REGEX_TEXT,
                    message: '空白が含まれてます',
                  },
                })}
                error={errors['company']}
              />
              <StyledInputField
                label="メールアドレス"
                placeholder="例：hal_tokyo@example.com"
                registration={register('email', {
                  required: '未入力です',
                  maxLength: {
                    value: 50,
                    message: '50文字以内で入力してください',
                  },
                  pattern: {
                    value: REGEX_EMAIL,
                    message: '不正なメールアドレスです',
                  },
                })}
                error={errors['email']}
              />
              <StyledPasswordField
                label="パスワード"
                placeholder="6文字以上の半角英数字で入力してください"
                registration={register('password', {
                  required: '未入力です',
                  minLength: {
                    value: 6,
                    message: '6文字以上で入力してください',
                  },
                  maxLength: {
                    value: 50,
                    message: '50文字以内で入力してください',
                  },
                  pattern: {
                    value: REGEX_PASSWORD,
                    message: '半角英数字をそれぞれ1種類以上含めてください',
                  },
                })}
                onChange={() => trigger('re-password')}
                error={errors['password']}
              />
              <StyledPasswordField
                label="パスワード（確認）"
                placeholder="パスワードを再度入力してください"
                registration={register('re-password', {
                  required: '未入力です',
                  validate: value => value === getValues('password') || 'パスワードが一致しません',
                })}
                onChange={() => trigger('password')}
                error={errors['re-password']}
              />
              <SelectField
                label="職種"
                registration={register('occupation', { required: '未選択です' })}
                options={occupationOptions}
                error={errors['occupation']}
              />
              <StyledItemInputField
                label="保有資格(17文字以内)"
                items={certifications}
                setItems={setCertifications}
                placeholder="保有資格を入力してください"
              />
              <StyledItemInputField
                label="興味のあること(17文字以内)"
                items={interests}
                setItems={setInterests}
                placeholder="興味のあることを入力してください"
              />

              <StyledTerms>
                下のボタンをクリックすることで、<StyledTermsLink to="">利用規約</StyledTermsLink>と
                <StyledTermsLink to="">プライバシーポリシー</StyledTermsLink>
                の内容に同意したものとみなします。
              </StyledTerms>

              <StyledSignUpButton
                text="登録"
                disabled={isDisabled}
                onClick={handleSubmit(trySignUp)}
              />
            </StyledRightColumn>
          </StyledFormWrapper>
        </StyledSignUp>
        <StyledBackground />
      </StyledWrapper>
    </>
  )
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100vw;
  padding-top: ${({ theme }) => theme.HEADER_HEIGHT};
  input {
    cursor: url('feather-pen.png') 10 124, pointer;
  }
`
const StyledSignUp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${calculateMinSizeBasedOnFigma(840)};
  height: 100%;
  margin: ${calculateMinSizeBasedOnFigma(26)} 0;
  padding: ${calculateMinSizeBasedOnFigma(64)} 0;
  background-image: url('contract-paper.png');
  background-size: 100% 100%;
`
const StyledLogoImg = styled.img`
  height: ${calculateMinSizeBasedOnFigma(108)};
`
const StyledH1 = styled.h1`
  margin: ${calculateMinSizeBasedOnFigma(33)} 0;
  background: -webkit-linear-gradient(
    top,
    ${({ theme }) => theme.COLORS.TENN},
    ${({ theme }) => theme.COLORS.NERO}
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: ${({ theme }) => theme.FONT_SIZES.SIZE_40};
  font-weight: ${({ theme }) => theme.FONT_WEIGHTS.MEDIUM};
`
const StyledFormWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  width: ${calculateMinSizeBasedOnFigma(706)};
`
const StyledRightColumn = styled.div.attrs<{ margin: string }>(({ margin }) => ({
  margin,
}))<{ margin: string }>`
  margin: ${({ margin }) => margin};
  width: ${calculateMinSizeBasedOnFigma(480)};
`
const formTagCss = css`
  width: 100%;
  height: ${calculateMinSizeBasedOnFigma(40)};
  border: solid 1px ${({ theme }) => theme.COLORS.CHOCOLATE};
  border-radius: 2px;
  background-color: ${({ theme }) => convertIntoRGBA(theme.COLORS.WHITE, 0.7)};
  border: solid 1px ${theme.COLORS.CHOCOLATE};
  border-radius: 2px;
  color: ${({ theme }) => theme.COLORS.BLACK};
`
const fieldCss = css`
  label {
    color: ${({ theme }) => theme.COLORS.CHOCOLATE};
    font-size: ${({ theme }) => theme.FONT_SIZES.SIZE_16};
    font-weight: ${({ theme }) => theme.FONT_WEIGHTS.SEMIBOLD};
  }
`
const StyledInputField = styled(InputField)`
  ${fieldCss}
  input {
    ${formTagCss}
    &::placeholder {
      font-size: ${({ theme }) => theme.FONT_SIZES.SIZE_14};
      color: ${({ theme }) => theme.COLORS.GRAY};
    }
  }
`
const StyledPasswordField = StyledInputField.withComponent(PasswordField)
const StyledImageInputField = styled(ImageInputField).attrs<{ innerWidth: number }>(
  ({ innerWidth }) => ({
    innerWidth,
  }),
)<{ innerWidth: number }>`
  margin: ${({ innerWidth }) =>
    innerWidth <= 1210
      ? `0 auto ${calculateMinSizeBasedOnFigma(24)} auto`
      : `0 0 ${calculateMinSizeBasedOnFigma(24)} 0`};
`
const StyledItemInputField = styled(ItemInputField)`
  margin-bottom: ${calculateMinSizeBasedOnFigma(24)};
  & input {
    width: ${calculateMinSizeBasedOnFigma(400)};
    height: ${calculateMinSizeBasedOnFigma(40)};
  }
`
const StyledBackground = styled.div`
  z-index: ${({ theme }) => theme.Z_INDEX.INDEX_MINUS_1};
  position: fixed;
  top: ${({ theme }) => theme.HEADER_HEIGHT};
  left: 0;
  width: 100vw;
  height: calc(100vh - ${({ theme }) => theme.HEADER_HEIGHT});
  background-image: url('register-background.png');
  background-size: cover;
  background-position: 50% 100%;
`
const StyledTerms = styled.p`
  margin: ${calculateMinSizeBasedOnFigma(24)} 0;
  font-size: ${({ theme }) => theme.FONT_SIZES.SIZE_14};
  font-weight: ${({ theme }) => theme.FONT_WEIGHTS.LIGHT};
`
const StyledTermsLink = styled(Link)`
  color: ${({ theme }) => theme.COLORS.BRIGHT_TURQUOISE};
  font-weight: ${({ theme }) => theme.FONT_WEIGHTS.SEMIBOLD};
`
type Disabled = { disabled: boolean }
const StyledSignUpButton = styled(CoarseButton).attrs<Disabled>(({ disabled }) => ({
  disabled,
}))<Disabled>`
  display: block;
  margin: 0 auto;
  width: ${calculateMinSizeBasedOnFigma(120)};
  height: ${calculateMinSizeBasedOnFigma(32)};
  box-shadow: 0px 2px 4px 0px ${({ theme }) => convertIntoRGBA(theme.COLORS.BLACK, 0.25)};
  font-size: ${({ theme }) => theme.FONT_SIZES.SIZE_14};
  font-weight: ${({ theme }) => theme.FONT_WEIGHTS.SEMIBOLD};
  > div > div > div {
    border: none;
  }

  ${({ disabled, theme }) => {
    if (disabled) {
      return css`
        color: ${theme.COLORS.SILVER};
        > div {
          background-color: ${convertIntoRGBA(theme.COLORS.ALTO, 0.55)};
          > div > div {
            background-color: ${convertIntoRGBA(theme.COLORS.NOBEL, 0.64)};
          }
        }
      `
    } else {
      return css`
        color: ${theme.COLORS.TEQUILA};
        > div {
          background-color: ${convertIntoRGBA(theme.COLORS.CHOCOLATE, 0.3)};
          > div > div {
            background-color: ${convertIntoRGBA(theme.COLORS.ERROR, 0.5)};
          }
        }
      `
    }
  }}
`
