/**
 * Predicts the number of weeks needed to reach a target 1RM based on lift history using linear regression and the Epley formula.
 */

/**
 * Estimates the one-rep maximum (1RM) using the Epley formula.
 * Epley: 1RM = Weight * (1 + Reps / 30)
 * @param {number} weight - Weight lifted (lbs).
 * @param {number} reps - Number of repetitions.
 * @returns {number} Estimated 1RM.
 */
const estimate1RM = (weight, reps) => {
    // Only use sets that are within a reasonable rep range for estimation accuracy (e.g., 1-10 reps)
    if (reps === 0 || reps > 12) return 0; 
    return Math.round(weight * (1 + reps / 30));
};

/**
 * Performs simple linear regression on a set of (x, y) data points.
 * @param {Array<{x: number, y: number}>} data - Array of points where x is weeks and y is 1RM.
 * @returns {{m: number, b: number}} Slope (m) and Y-intercept (b).
 */
const linearRegression = (data) => {
    const N = data.length;
    if (N < 2) return { m: 0, b: 0 }; 

    const sumX = data.reduce((sum, p) => sum + p.x, 0);
    const sumY = data.reduce((sum, p) => sum + p.y, 0);
    const sumXX = data.reduce((sum, p) => sum + p.x * p.x, 0);
    const sumXY = data.reduce((sum, p) => sum + p.x * p.y, 0);

    const m = (N * sumXY - sumX * sumY) / (N * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / N;

    return { m, b }; // m is the rate of progress (1RM lbs per week)
};

/**
 * Processes logs, predicts progress rate, and forecasts time to target weight.
 * @param {Array<Object>} logs - The user's lift history logs.
 * @param {Array<Object>} split - The split data to find exercise names.
 * @param {number} targetWeight - The desired 1RM weight to reach.
 * @returns {number | string} - Number of weeks, or "Not enough data".
 */
export const predictPRWeeks = (logs, split, targetWeight) => {
    // 1. Find all exercise IDs that match "Bench Press"
    const benchPressIds = [];
    split.forEach(day => {
        day.exercises.forEach(exercise => {
            // Match "Bench Press" exactly (case insensitive)
            if (exercise.name.toLowerCase() === 'bench press') {
                benchPressIds.push(exercise.id);
            }
        });
    });

    if (benchPressIds.length === 0) {
        return "Not enough data";
    }

    // 2. Filter logs for Bench Press exercises
    const benchLogs = logs.filter(log => benchPressIds.includes(log.exerciseId));

    // 3. Check for minimum data requirement (e.g., 5 sets required)
    if (benchLogs.length < 5) {
        return "Not enough data";
    }

    // 4. Group by weekId and find the max estimated 1RM for each week
    const weeklyMax1RM = {};

    benchLogs.forEach(log => {
        const est1RM = estimate1RM(log.weight, log.reps);

        if (est1RM > 0) {
            weeklyMax1RM[log.weekId] = Math.max(weeklyMax1RM[log.weekId] || 0, est1RM);
        }
    });

    // 5. Convert weekly data to (x=week, y=1RM) points for regression
    // Sort week IDs chronologically and assign sequential numbers
    const sortedWeekIds = Object.keys(weeklyMax1RM).sort();
    
    const regressionData = sortedWeekIds
        .map((weekId, index) => ({
            x: index, // Sequential week number
            y: weeklyMax1RM[weekId]
        }))
        .filter(point => point.y > 0);
        
    // Needs at least two distinct weeks of data to calculate a trend
    if (regressionData.length < 2) {
        return "Not enough data";
    }
    
    // 6. Perform Linear Regression
    const { m: progressRate, b: currentFitnessBase } = linearRegression(regressionData);

    // If target weight is less than or equal to current best 1RM, the prediction is 0 weeks (already reached)
    const currentMax1RM = Math.max(...regressionData.map(p => p.y));
    if (targetWeight <= currentMax1RM) {
        return 0; 
    }
    
    // 7. Predict Weeks to Target
    
    // If progress rate is zero or negative (m <= 0), we can't predict a future increase
    if (progressRate <= 0.5) { // Use a small threshold (0.5 lbs/week) instead of 0
         // Calculate the time based on the highest recorded 1RM and the rate of progress
         const weeksNeeded = Math.ceil((targetWeight - currentMax1RM) / 0.5); 
         return `> ${weeksNeeded}`;
    }

    // Solve for x (weeks) in the linear equation: Target = m*x + b
    const predictedWeeks = Math.ceil((targetWeight - currentFitnessBase) / progressRate);

    // Ensure the prediction is not negative)
    return Math.max(0, predictedWeeks);
};