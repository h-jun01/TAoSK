import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { CoarseButton } from 'components/ui/button/CoarseButton'
import { InputItem } from 'components/ui/form/InputItem'
import { convertIntoRGBA } from 'utils/color/convertIntoRGBA'
import { theme } from 'styles/theme'

type InputAspectStyles = Record<'width' | 'height', string>
type Props = {
  className?: string
  label: string
  placeholder?: string
  inputAspect: InputAspectStyles
}

export const ItemInputField: FC<Props> = props => {
  const { className, label, placeholder, inputAspect } = props
  const [value, setValue] = useState<string>('')
  const [items, setItems] = useState<string[]>([])
  const onClickAddButton = () => {
    if (!value) return
    items.push(value)
    setItems(items.slice())
    setValue('')
  }
  const onClickCrossButton = (item: string) => {
    const index = items.indexOf(item)
    items.splice(index, 1)
    setItems(items.slice())
  }

  return (
    <div className={className}>
      {label}
      <StyledInput
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        {...inputAspect}
      />
      <CoarseButton
        text="追加"
        aspect={{
          width: '64px',
          height: '40px',
        }}
        outerBgColor={convertIntoRGBA(theme.COLORS.TEMPTRESS, 0.2)}
        innerBgColor={convertIntoRGBA(theme.COLORS.RED_OXIDE, 0.45)}
        color={theme.COLORS.BRANDY}
        onClick={onClickAddButton}
      />
      <div>
        {items.map((item, index) => (
          <InputItem itemName={item} key={index} onClick={() => onClickCrossButton(item)} />
        ))}
      </div>
    </div>
  )
}

const StyledInput = styled.input<InputAspectStyles>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  background-color: ${({ theme }) => convertIntoRGBA(theme.COLORS.WHITE, 0.7)};
  border: solid 1px ${({ theme }) => theme.COLORS.CHOCOLATE};
  border-radius: 2px;
`
