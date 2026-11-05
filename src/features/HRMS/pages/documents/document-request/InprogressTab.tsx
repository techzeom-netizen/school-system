import RequestTableTab, { RequestTableTabProps } from './RequestTableTab';

type Props<TData extends { id: string }> = Omit<
  RequestTableTabProps<TData>,
  'emptyMessage'
>;

const InprogressTab = <TData extends { id: string }>(props: Props<TData>) => (
  <RequestTableTab
    {...props}
    emptyMessage="No document requests are in progress."
  />
);

export default InprogressTab;
