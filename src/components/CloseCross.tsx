import styled from "styled-components";

type CloseCrossWrapperProps = {
  color: string;
  hoverColor?: string;
};
const SCloseCrossWrapper = styled.div<CloseCrossWrapperProps>`
  transform: translateX(50%);

  cursor: pointer;
  --close-color: ${({ color }) => color};

  :hover {
    --close-color: ${({ hoverColor, color }) => hoverColor || color};
  }

  svg path {
    fill: var(--close-color);
  }
`;

type CloseCrossProps = CloseCrossWrapperProps & {
  onClick: () => void;
};
export const CloseCross = ({ color, hoverColor, onClick }: CloseCrossProps) => {
  return (
    <SCloseCrossWrapper color={color} hoverColor={hoverColor} onClick={onClick}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.49998 1.37878L4.56064 2.43944L12 9.87878L19.4393 2.43944L20.5 1.37878L22.6213 3.5001L21.5606 4.56076L14.1213 12.0001L21.5606 19.4394L22.6213 20.5001L20.5 22.6214L19.4393 21.5608L12 14.1214L4.56064 21.5608L3.49998 22.6214L1.37866 20.5001L2.43932 19.4394L9.87866 12.0001L2.43932 4.56076L1.37866 3.5001L3.49998 1.37878Z"
        />
      </svg>
    </SCloseCrossWrapper>
  );
};
