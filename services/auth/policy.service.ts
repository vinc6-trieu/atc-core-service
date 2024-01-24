import POLICY_MODEL, { PolicyDocument } from '../../models/policy.model'
import { BaseService } from '../../shared/base/service.base'

class PolicyService extends BaseService<PolicyDocument> {
  constructor() {
    super(POLICY_MODEL)
  }
}

export const policyService = new PolicyService()
