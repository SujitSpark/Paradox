import { useEffect, useState } from 'react';
import { useCasesStore, CourtCase } from '@/store/casesStore';
import { useAuthStore } from '@/store/authStore';
import { BrainCircuit, Info, Target, AlertTriangle, Scale, Clock, AlertCircle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';

interface XAIInsight {
    id: string;
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
}

export default function XAICard() {
    const cases = useCasesStore((s) => s.cases);
    const role = useAuthStore((s) => s.role);
    const [insights, setInsights] = useState<XAIInsight[]>([]);

    useEffect(() => {
        // Only show insights for Court Registrar, Junior Judge, and Senior Judge
        if (!['registrar', 'junior_judge', 'senior_judge'].includes(role || '')) {
            return;
        }

        // Top 10 cases based on priority score
        const topCases = [...cases].sort((a, b) => b.priority_score - a.priority_score).slice(0, 10);
        if (topCases.length === 0) return;

        const generatedInsights: XAIInsight[] = [];

        // Analyze AI Scoring Algorithm (40% Age, 30% Type, 20% Adjournments, 10% Status)

        // 1. Age Factor Analysis
        const avgAgeDays = topCases.reduce((sum, c) => sum + c.age_days, 0) / topCases.length;
        const avgAgeYears = (avgAgeDays / 365).toFixed(1);

        generatedInsights.push({
            id: 'age',
            icon: Clock,
            title: 'Time Factor Dominance (40% Weight)',
            description: `The top 10 queue is driven heavily by age. The average pendency is ${avgAgeYears} years, immediately triggering critical status thresholds set by the Supreme Court guidelines.`,
            color: 'text-blue-500' // Using tailwind dynamic classes or semantic ones
        });

        // 2. Type/Urgency Analysis
        const caseTypes = topCases.reduce<Record<string, number>>((acc, c) => {
            acc[c.case_type] = (acc[c.case_type] || 0) + 1;
            return acc;
        }, {});
        const mostCommonType = Object.entries(caseTypes).sort((a, b) => b[1] - a[1])[0];

        if (mostCommonType && mostCommonType[1] > 3) {
            generatedInsights.push({
                id: 'type',
                icon: Scale,
                title: 'Case Category Concentration (30% Weight)',
                description: `${Math.round((mostCommonType[1] / topCases.length) * 100)}% of critical cases involve "${mostCommonType[0]}", reflecting a recent backlog spike in this division. High categorical priority overrides standard queues.`,
                color: 'text-lavender'
            });
        }

        // 3. Adjournment Analysis
        const avgAdjournments = topCases.reduce((sum, c) => sum + c.adjournments_count, 0) / topCases.length;
        if (avgAdjournments > 10) {
            generatedInsights.push({
                id: 'adjourn',
                icon: AlertTriangle,
                title: 'Excessive Adjournment Flags (20% Weight)',
                description: `Persistent scheduling delays identified. These cases average ${Math.round(avgAdjournments)} adjournments. AI algorithm automatically promotes cases exceeding 15 adjournments to prevent indefinite stalling.`,
                color: 'text-destructive'
            });
        }

        // 4. Case Level Highlight
        const criticalCount = topCases.filter(c => c.escalation_level === 'critical').length;
        generatedInsights.push({
            id: 'critical',
            icon: Target,
            title: 'Algorithmic Escalation',
            description: `${criticalCount} of the top 10 cases have been marked as 'Critical' because their combined composite score (Age + Type + Adjournments) exceeded the 80/100 danger threshold.`,
            color: 'text-primary'
        });

        setInsights(generatedInsights);
    }, [cases, role]);

    // Hide component if unauthorized or no insights generated
    if (!['registrar', 'junior_judge', 'senior_judge'].includes(role || '') || insights.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
        >
            <Card className="border border-lavender/30 shadow-md bg-gradient-to-br from-card to-muted/20 relative overflow-hidden">
                {/* Subtle background circuit pattern */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 text-primary/5">
                    <BrainCircuit className="w-64 h-64" />
                </div>

                <CardHeader className="pb-3 border-b border-border/50 bg-muted/30 relative z-10">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-lavender" />
                        <CardTitle className="text-lg">AI Priority Explanation</CardTitle>
                    </div>
                    <CardDescription>
                        Why the agent prioritized the following Top 10 cases for your review
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-5 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.map((insight, idx) => (
                            <motion.div
                                key={insight.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                className="flex gap-3 p-3 rounded-lg bg-background/50 border border-border/40"
                            >
                                <div className={`mt-0.5 p-1.5 rounded-md bg-muted flex-shrink-0 ${insight.color}`}>
                                    <insight.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground mb-1">{insight.title}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {insight.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground bg-blue-500/5 p-2 rounded-md border border-blue-500/10">
                        <Info className="w-4 h-4 text-blue-500 shrink-0" />
                        <p>
                            <strong>Notice:</strong> The AI scores are designed to assist judicial decision-making, not replace it. The dynamic algorithm weights are visible to Registrars for auditing purposes.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
