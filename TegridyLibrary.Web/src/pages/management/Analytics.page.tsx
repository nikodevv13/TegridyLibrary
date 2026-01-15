"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, BookOpen, Users, Library, Repeat } from "lucide-react";
import { motion } from "framer-motion";
import useGlobalAnalytics from "@/hooks/analytics/useGlobalAnalytics";

// Model
export interface GlobalAnalyticsReadModel {
    totalBooks: number;
    totalCopies: number;
    totalActiveBookLoans: number;
    totalBookLoans: number;
    totalReaders: number;
}

const itemsConfig = [
    {
        key: "totalBooks",
        label: "Books",
        icon: Book,
    },
    {
        key: "totalCopies",
        label: "Book copies",
        icon: Library,
    },
    {
        key: "totalActiveBookLoans",
        label: "Active Book Loans",
        icon: BookOpen,
    },
    {
        key: "totalBookLoans",
        label: "Total book loans",
        icon: Repeat,
    },
    {
        key: "totalReaders",
        label: "Readers",
        icon: Users,
    },
] as const;

export default function AnalyticsPage() {
    const { data, isLoading } = useGlobalAnalytics();

    if (isLoading) {
        return <div className="p-6 text-muted-foreground">Loading analytics...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">📊 Libarary Analytics</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {itemsConfig.map((item, index) => (
                    <motion.div
                        key={item.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                    >
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {item.label}
                                </CardTitle>
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {data![item.key]}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
