import RequestTableTab, { RequestTableTabProps } from './RequestTableTab';

type Props<TData extends { id: string }> = Omit<
  RequestTableTabProps<TData>,
  'emptyMessage'
>;

const OverDueTab = <TData extends { id: string }>(props: Props<TData>) => (
  <RequestTableTab {...props} emptyMessage="No overdue document requests." />
);

export default OverDueTab;
