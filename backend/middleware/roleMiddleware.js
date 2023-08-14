import { ADMIN, USER } from '../constants/index'

const ROLES = {
    User: USER,
    Admin: ADMIN
}

const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.user && !req?.roles) {
            res.status(401)
            throw new Error('Unauthorized')
        }
        const rolesArr = [...allowedRoles]

        const roleFound = req.roles.map(role => rolesArr.includes(role))
            .find(value => value === true)

        if (!roleFound) {
            res.status(401)
            throw new Error('Unauthorized')
        }
        next()
    }
}

const ROLE = { ROLES, checkRole }

export default ROLE