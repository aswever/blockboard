import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then(res => res.json())
const useApiSwr = (endpoint: string) => useSWR(endpoint, fetcher);
