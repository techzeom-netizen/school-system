import RequestTableTab, { RequestTableTabProps } from './RequestTableTab';

type Props<TData extends { id: string }> = Omit<
  RequestTableTabProps<TData>,
  'emptyMessage'
>;

const RejectedTab = <TData extends { id: string }>(props: Props<TData>) => (
  <RequestTableTab
    {...props}
    emptyMessage="No document requests have been rejected."
  />
);

export default RejectedTab;
