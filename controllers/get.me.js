
export const getme = async (req, res) => {
    try {
        const user = req.user;
        const response = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
        if (user.role === "student") {
            response.student = {
                studentId: user.studentId,
                institutionName: user.institutionName,

            };
        }

        // INSTITUTE
        if (user.role === "institute") {
            response.institute = {
                instituteName: user.instituteName,
                instituteId: user.instituteCode,

            };
        }

        // HR
        if (user.role === "hr") {
            response.hr = {
                companyName: user.companyName,
                hrId: user.hrId,

            };
        }
        res.status(200).json({
            success: true,
            user: req.user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user details"
        })
    }

}