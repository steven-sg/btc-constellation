import React, { Component } from 'react';
import { Modal, Image, Pagination, Icon, Header } from 'semantic-ui-react';
import automaticContributionIMG from '../images/automatic_contribution.png';
import manualContributionIMG from '../images/manual_contribution.png';
import paymentIMG from '../images/payment.png';
import currencyIMG from '../images/currency.png';
import signingIMG from '../images/signing.png'
import feeIMG from '../images/fee.png';
import returnAddressIMG from '../images/return_address.png';
import transactionLogIMG from '../images/transaction_log.png';
import transactionStateIMG from '../images/transaction_state.png';
import publishIMG from '../images/publish_transaction.png';

function ContributionFrameHelp () {
  const page1 = (
    <div>
      <p>
        Bitcoin balances are stored within bitcoin transactions. Not wallets. Not addresses.
        Transaction are defined about "inputs" and "outputs". Inputs are references to other transaction outputs,
        they act like contributions to the transaction and define the collective value. Outputs are then
        analogous to payments, where the collective value of the inputs are spent.
      </p>
      <p>
        ALL unspent bitcoins are spent as fees.
      </p>
      <p>
        Here, we first define the inputs. Begin by using the automatic input system, that utilizes
        a third party service to extract unspent balances belonging to an address. Or, make
        use of the manual input system to fill in the necessary information yourself.
      </p>
    </div>
  );

  const page2 = (
    <div>
      <Image src={automaticContributionIMG} size='large'/>
      <p style={{wordBreak: 'break-word', marginTop: '1rem'}}>
        To add an input/ inputs using the automatic system, simply enter in your
        bitcoin address and click "Add Contribution". This will pull all the unspent transaction outputs
        that relate to the specified address. The outputs may be pruned if necessary. The address should
        exist in the network that you selected on the first page.
      </p>
    </div>
  );

  const page3 = (
    <div>
      <Image src={manualContributionIMG} size='large'/>
      <p style={{wordBreak: 'break-word', marginTop: '1rem'}}>
        A transaction input requires 3 pieces of information to be defined.
      </p>
      <ul>
        <li>
          <h5>The transaction hash</h5>
            To identify the transaction where the bitcoins are stored/recieved.
        </li>
        <li>
          <h5>The output index</h5>
            To identify which output within the specified transaction that the
            bitcoins are stored.
        </li>
        <li>
          <h5>The script</h5>
            This is the authentication measure required to prove the ownership
            of the value. Effectively, it is the "lock" that secures the bitcoins.
        </li>
      </ul>
      <p>
        To add an input using the manual system, provide the above stated details and click "Add Contribution".
        Once again, the transaction should belong to the network you selected on the first page.
      </p>
      <p>
        The balance is not required to define the transaction input. However it is
        necessitated in this software as a convenience measure for later computation.
      </p>
    </div>
  );

  const page4 = (
    <div>
      <Image src={currencyIMG} size='large'/>
      <p style={{wordBreak: 'break-word', marginTop: '1rem'}}>
        The currency format can be changed by using the dropdown next to the balance shown in the picture above.
        This will change the currency displayed as well as the currency for input.
      </p>
    </div>
  );

  const page5 = (
    <div>
      <p>
        The manual input form has been filled out for you. Please click "Add Contribution" to add the defined transaction input
        and click "Next" on the bottom right to continue.
      </p>
    </div>
  );
  
  return [
    {
      title: 'Add Transaction Input',
      page: page1,
    },
    {
      title: 'Add Input Automatically',
      page: page2,
    },
    {
      title: 'Add Input Manually',
      page: page3,
    },
    {
      title: 'Changing The Currency Format',
      page: page4,
    },
    {
      title: 'Tutorial',
      page: page5,
    },
  ]
}

function PaymentFrameHelp () {
  const page1 = (
    <div>
      <Image src={paymentIMG} size='large'/>
      <p style={{wordBreak: 'break-word', marginTop: '1rem'}}>
        After defining inputs for our transaction, we can now create the outputs for our expenditures.
      </p>
      <p>
        To add an output, simply enter in the bitcoin address of your recipient, the amount you wish to send
        and click "Add Payment". Similar to the inputs, ensure that the recipient address on the same network
        as your inputs.
      </p>
    </div>
  );

  const page2 = (
    <div>
      <p>
      The input form for payments has been filled out for you. Please click "Add Payment" to add the pre-defined
      transaction output. Then click "Next" on the bottom right to continue.
      </p>
    </div>
  );
  return [
    {
      title: 'Add Transaction Outputs',
      page: page1,
    },
    {
      title: 'Tutorial',
      page: page2,
    },
  ];
}

function SigningFrame () {
  const page1 = (
    <div>
      <Image src={signingIMG} size='large'/>
      <p style={{wordBreak: 'break-word', marginTop: '1rem'}}>
        We now need to authenticate the usage of each of our transaction inputs.
      </p>
      <p>
        For each transaction input, enter the private key for each bitcoin address that corresponds.
        Press the "Unlock" button to authenticate the transaction input. Once unlocked, you can press
        the lock icon to unauthenticate.
      </p>
    </div>
  );
  const page2 = (
    <div>
      <p>
        The private key has been filled out for you.
        Please click the "Unlock" button and click "Next" on the bottom right to continue.
      </p>
    </div>
  );
  return [
    {
      title: 'Authentication',
      page: page1,
    },
    {
      title: 'Tutorial',
      page: page2,
    }
  ];
}

function FeesFrame () {
  const page1 = (
    <div>
      <p>
        The last step is to set the amount of change that you wish to recieve.
      </p>
      <p>
        The fee is calculated as the collected input - the spent output. Therefore
        anything that you don't spend is used as fee to process your transaction.
        To circumvent this and simulate the idea of "change", we send money back to ourself.
      </p>
    </div>
  );
  const page2 = (
    <div>
      <Image src={returnAddressIMG} size='large'/>
      <p style={{wordBreak: 'break-word', marginTop: '1rem'}}>
        Use the above dropdown to set which return address you wish to use for change,
        or input an unlisted address. Alternatively you can leave the return address unset.
        However, no change will be processed and all unspent inputs will be
        used in the fee.
      </p>
    </div>
  );
  const page3 = (
    <div>
      <Image src={feeIMG} size='large'/>
      <p style={{wordBreak: 'break-word', marginTop: '1rem'}}>
        The above input shows the total fee as well as the fee per kB. The higher the
        fee rate, the higher the priority of your transaction. This effectively means that
        the more you spend on fees, the quicker your transaction will be processed. However,
        conversely this means that if your fee rate is too low, then your transaction may
        end up <b>never</b> being processed.
      </p>
      <p>
        Use the input provided to fine tune the fee rate. It may be
        beneficial to use an online service to check what the standard fee rate is for your
        chosen network.
      </p>
    </div>
  );
  const page4 = (
    <div>
      <p>
        The return address has been decided for you. Click on the drop down and select the
        return address for confirmation. Tune the fee rate however you wish.
        Then, click "Next" on the bottom right to continue.
      </p>
    </div>
  );
  return [
    {
      title: 'Fees',
      page: page1,
    },
    {
      title: 'Set Return Address',
      page: page2,
    },
    {
      title: 'Set Fee Rate',
      page: page3,
    },
    {
      title: 'Tutorial',
      page: page4,
    },
  ];
}

function TransactionFrame () {
  const page1 = (
    <div>
      <Image src={transactionLogIMG} size='large'/>
      <p style={{wordBreak: 'break-word', marginTop: '1rem'}}>
        And That's all. You have created the transaction.
      </p>
      <p>
        The sequence of numbers at the top shows your signed transaction. This contains all the data
        regarding your transaction. It is also used to create the "transaction hash" as seen
        previously.
      </p>
      <p>
        The breakdown below show section by section all the steps that was required to create the
        transaction.
      </p>
    </div>
  );
  const page2 = (
    <div>
      <p>
        <h5>Version Code</h5>
        This software creates only version 1 transactions.
      </p>
      <p>
        <h5>Input Count</h5>
        This defines how many inputs are used in the transaction.
      </p>
      <p>
        <h5>Inputs</h5>
        Each input is then defined.
      </p>
      <p>
        <h5>Output Count</h5>
        This defines how many outputs are used in the transaction.
      </p>
      <p>
        <h5>Outputs</h5>
        Each output is then defined.
      </p>
      <p>
        <h5>Locktime</h5>
        This defines a restriction on when a transaction can be processed based on either
        block height or unix epoch. This software does not support variable locktime.
      </p>
      <p>
        <h5>Hash Code</h5>
        TODO
      </p>
      <p>
        <h5>Signing The Inputs</h5>
        Finally, the inputs are signed based on the constructed raw unsigned transaction.
        The computed signature then replaces the original input script.
      </p>
    </div>
  );
  const page3 = (
    <div>
      <Image src={transactionStateIMG} size='large'/>
      <p style={{wordBreak: 'break-word', marginTop: '1rem'}}>
        The section titles can be expanded to show the state of the raw transaction after each computational block.
        In this view, the transaction state is broken down respectively to show what each substring of the
        transaction represents.
      </p>
    </div>
  );
  const page4 = (
    <div>
      <Image src={publishIMG} size='large'/>
      <p style={{wordBreak: 'break-word', marginTop: '1rem'}}>
        Now that you have created your transaction, click the "Publish" button on the bottom
        right if you wish submit the transaction. Otherwise don't. No transfer of balance will
        be enacted, and you can simply marvel at the transaction that you created.
      </p>
    </div>
  );
  return [
    {
      title: 'Transaction Breakdown',
      page: page1,
    },
    {
      title: 'Breakdown Sections',
      page: page2,
    },
    {
      title: 'Show Transaction State',
      page: page3,
    },
    {
      title: 'Publish Transaction',
      page: page4,
    },
  ];
}

class HelpModal extends Component {
  constructor (props) {
    super(props);
    const pages = this.getPages();
    this.state = {
      pages,
      activePage: 1,
      totalPages: pages.length,
    }
  }

  handlePaginationChange = (e, { activePage, totalPages }) => {
    if (activePage > 0 && activePage <= totalPages) {
      this.setState({ activePage })
    }
  }

  getPages = () => {
    switch (this.props.frame) {
      case 'contribution':
        return ContributionFrameHelp();
      case 'payment':
        return PaymentFrameHelp();
      case 'signing':
        return SigningFrame();
      case 'fees':
        return FeesFrame();
      case 'transaction':
        return TransactionFrame();
      default:
        return [];
    }
  }

  render () {
    return (
      <Modal open={this.props.open}
             onOpen={this.props.handleOpen}
             onClose={this.props.handleClose}
             size='tiny'>
        <Modal.Header>{this.state.pages[this.state.activePage - 1].title}</Modal.Header>
        <Modal.Content scrolling>
          <Modal.Description>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'auto'}}>
                <div style={{marginBottom:'1rem'}}>
                  {this.state.pages[this.state.activePage - 1].page}
                </div>
                <Pagination
                  activePage={this.state.activePage}
                  prevItem={{ content: <Icon name='angle left' />, icon: true }}
                  nextItem={{ content: <Icon name='angle right' />, icon: true }}
                  firstItem={null}
                  lastItem={null}
                  pointing
                  secondary
                  onPageChange={this.handlePaginationChange}
                  totalPages={this.state.totalPages}/>
              </div>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default HelpModal;
