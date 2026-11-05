import RequestTableTab, { RequestTableTabProps } from './RequestTableTab';

type Props<TData extends { id: string }> = Omit<
  RequestTableTabProps<TData>,
  'emptyMessage'
>;

const WaitingForYouTab = <TData extends { id: string }>(
  props: Props<TData>
) => (
  <RequestTableTab
    {...props}
    emptyMessage="No requests are waiting for your review."
  />
);

export default WaitingForYouTab;
