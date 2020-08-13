const { adminHandler } = require('../handlers');

const admin = {
	getExaminerDetails: async (req, res) => {
		let queryType = req.query.type;
		let pageIndex = parseInt(req.query.pageIndex);
		let pageSize = parseInt(req.query.pageSize);
		let msg = '';
		if (queryType) {
			let examiner = await adminHandler.getExaminerDetails(
				queryType,
				pageIndex,
				pageSize
			);
			if (examiner.length === 0) msg = `No ${queryType} examiner found`;
			res.status(200).send({ examiner: examiner, msg: msg });
		} else {
			let examinerCount = await adminHandler.getExaminerCount();
			res.status(200).send(examinerCount);
		}
	},
};

module.exports = admin;
