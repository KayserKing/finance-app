'use client'
import { Button, SelectOptionsInput, Topic } from "@/components"
import { useDashboardService } from "@/services";
import { useState } from "react";
import { toast } from "react-toastify";
import { ErrorResponse } from "./schema";

type ReportResponse = {
    data: {
        filePath: string;
    };
};

const Reports = () => {
    const [reportType, setReportType] = useState<string>('');
    const [range, setRange] = useState<string>('');
    const [query, setQuery] = useState<string>('')

    const { useGetCustomers, useDownloadReport, useDownloadDelete } = useDashboardService();
    const { data: getCustomers } = useGetCustomers('');
    const customersList = getCustomers?.data?.data?.map((e: { name: string, mobileNumber: string }) => { return e.name + ' - ' + e.mobileNumber }) || [];

    const {mutate:downloadDeleteMutate} = useDownloadDelete()
    const { mutate: downloadReportMutate } = useDownloadReport({
        onSuccess: async (res: unknown) => {
            const resData = res as ReportResponse;
            const link = document.createElement('a');
            link.href = resData?.data?.filePath;
            link.setAttribute('download', 'report.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            downloadDeleteMutate();
            toast.success('Report download successful')
        },
        onError: (error: unknown) => {
            const err = error as ErrorResponse;
            toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
            console.error('Download error:', error);
        }
      });

    const onSubmit = async () => {
        downloadReportMutate({
            type: reportType,
            customerId: reportType === 'CUSTOMER BASED' ? query : '',
            range,
        })
    }

    return <div>
        <Topic title="REPORTS" />
        <div className="flex flex-col gap-2">
            <SelectOptionsInput onChange={setReportType} options={['CUSTOMER BASED', 'DATE BASED']} value={reportType} className="" placeholder="Select Type" />
            {reportType == 'CUSTOMER BASED' && <SelectOptionsInput searchable onChange={setQuery} options={customersList} value={query} className="" placeholder="Select Customer" />}
            <SelectOptionsInput onChange={setRange} options={['THIS MONTH', 'LAST 3 MONTHS', 'FULL']} value={range} className="" placeholder="Select Range" />
        </div>
        <Button className="px-2 mt-2 max-sm:w-full" name="DOWNLOAD" type="button" handleClick={onSubmit} />
    </div>
}

export default Reports