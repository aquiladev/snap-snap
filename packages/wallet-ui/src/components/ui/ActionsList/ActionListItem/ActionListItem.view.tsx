import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { SelectableAction } from '../../../../types';
import {
  shortenAddress,
  getDate,
  humanizeFragment,
} from '../../../../utils/utils';
import * as ws from '../../../../slices/walletSlice';
import {
  Column,
  Description,
  Wrapper,
  IconStyled,
  Right,
  Link,
} from './ActionListItem.style';

type Props = {
  action: SelectableAction;
  isSelectable?: boolean;
};

export const ActionListItemView = ({ action, isSelectable }: Props) => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state) => state.networks);
  const explorerUrl = networks.items[networks.activeNetwork]?.explorerUrl;
  const { value, contractAddress, createdAt, functionFragment, selected } =
    action;

  const title = humanizeFragment(functionFragment) || 'Send';
  return (
    <Wrapper>
      {isSelectable && (
        <Column
          onClick={() => {
            dispatch(
              ws.updateAction({ ...action, selected: !action.selected }),
            );
          }}
          style={{ cursor: 'pointer' }}
        >
          <IconStyled
            icon={['fas', `${selected ? 'square-check' : 'square'}`]}
            style={{
              fontSize: 22,
            }}
          />
        </Column>
      )}
      <Column>
        <div style={{ marginBottom: 8 }}>
          <Description>
            <span style={{ fontSize: 18 }}>{title}</span>
          </Description>
        </div>
        <Description>
          <span style={{ color: 'green' }}>
            {getDate(createdAt)}&nbsp;&#183;
          </span>
          <span style={{ paddingLeft: 10, paddingRight: 4 }}>To:</span>
          <span style={{ color: 'slateGray' }}>
            <Link
              href={`${explorerUrl}/address/${contractAddress}`}
              rel="noopener noreferrer"
              target="_blank"
              id="explorer-link"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {shortenAddress(contractAddress)}
              <IconStyled
                icon={['fas', 'arrow-up-right-from-square']}
                style={{
                  paddingLeft: 5,
                }}
              />
            </Link>
          </span>
        </Description>
      </Column>
      <Right>
        <span>-{value} ETH</span>
      </Right>
    </Wrapper>
  );
};
