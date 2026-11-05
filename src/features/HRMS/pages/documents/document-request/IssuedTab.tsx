import RequestTableTab, { RequestTableTabProps } from './RequestTableTab';

type Props<TData extends { id: string }> = Omit<
  RequestTableTabProps<TData>,
  'emptyMessage'
>;

const IssuedTab = <TData extends { id: string }>(props: Props<TData>) => (
  <RequestTableTab
    {...props}
    emptyMessage="No documents have been issued for these filters."
  />
);

export default IssuedTab;
